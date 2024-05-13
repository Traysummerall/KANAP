document.addEventListener('DOMContentLoaded', async function () {
	const cartItemsContainer = document.getElementById('cart__items');
	const totalQuantityDisplay = document.getElementById('totalQuantityDisplay');
	const totalPriceElement = document.getElementById('totalPrice');
	const orderForm = document.getElementById('orderForm');
	const orderBtn = document.getElementById('orderBtn');

	// Define regular expressions for input validation
	const nameRegex = /^[a-zA-Z]+$/; // Only alphabets allowed in name fields
	const emailRegex = /^\S+@\S+\.\S+$/; // Email format validation
	const cityRegex = /^[a-zA-Z\s]*$/; // Only alphabets and spaces allowed in city field

	// Function to fetch product details from the backend API
	async function fetchProductDetails(productId) {
		try {
			const response = await fetch(`http://localhost:3000/api/products/${productId}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const product = await response.json();
			return product;
		} catch (error) {
			console.error('Error fetching product details:', error.message);
			return null;
		}
	}

	// Function to validate input fields using regex
	function validateInput(inputValue, regex) {
		return regex.test(inputValue);
	}

	// Function to display error message for input field
	function displayErrorMessage(inputField, message) {
		const errorMsgElement = inputField.nextElementSibling; // Assuming error message is next to input field
		errorMsgElement.textContent = message;
	}

	// Function to update cart items on the page
	async function updateCartItems() {
		if (!cartItemsContainer) {
			console.error('Cart items container not found.');
			return;
		}

		// Get cart items from local storage
		const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

		// Initialize total quantity and price
		let totalQuantity = 0;
		let totalPrice = 0;

		// Clear previous cart items
		cartItemsContainer.innerHTML = '';

		// Loop through cart items and create cart item elements
		for (const item of cartItems) {
			const product = await fetchProductDetails(item.productId);
			if (product) {
				if (item.quantity > 0) {
					// Only add items with quantity > 0
					totalQuantity += item.quantity;
					totalPrice += item.quantity * product.price;

					const cartItem = createCartItemElement(item, product);
					cartItemsContainer.appendChild(cartItem);
				}
			}
		}

		// Update total quantity and price on the page
		totalQuantityDisplay.textContent = totalQuantity;
		totalPriceElement.textContent = totalPrice.toFixed(2);
	}

	// Function to create a cart item element
	function createCartItemElement(item, product) {
		const cartItem = document.createElement('div');
		cartItem.classList.add('cart__item');
		cartItem.innerHTML = `
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="Product Image" class="productImage" />
            </div>
            <div class="cart__item__content">
                <h2>${product.name}</h2>
                <p>Color: ${item.color}</p>
                <p>Price: €${product.price}</p>
                <!-- Quantity input field -->
                <div class="item__content__settings">
                    <div class="item__content__settings__quantity">
                        <label for="itemQuantity-${item.productId}">Quantity:</label>
                        <input
                            type="number"
                            name="itemQuantity"
                            min="0"
                            max="100"
                            value="${item.quantity}"
                            id="itemQuantity-${item.productId}"
                            data-product-id="${item.productId}"
                            class="itemQuantityInput"
                        />
                    </div>
                    <!-- Delete button -->
                    <button class="deleteBtn" style="background: none; border: none; color: white; font-family: 'Montserrat', sans-serif; font-size: 16px; margin-top: 5px; margin-left: -5px;"
                        data-product-id="${item.productId}">Delete</button>
                </div>
            </div>
        `;
		return cartItem;
	}

	// Call updateCartItems when the page loads
	updateCartItems();

	// Event listener for quantity changes
	cartItemsContainer.addEventListener(
		'blur',
		async function (event) {
			if (event.target.classList.contains('itemQuantityInput')) {
				// Save the updated quantity to local storage
				const productId = event.target.dataset.productId;
				const newQuantity = parseInt(event.target.value);
				updateCartItemQuantity(productId, newQuantity);
			}
		},
		true
	); // Use capturing to ensure blur event is caught before focusout

	// Event listener for delete button clicks
	cartItemsContainer.addEventListener('click', function (event) {
		if (event.target.classList.contains('deleteBtn')) {
			const productId = event.target.dataset.productId;
			deleteCartItem(productId);
		}
	});

	// Function to update the quantity of an item in the cart and cart totals
	function updateCartItemQuantity(productId, newQuantity) {
		const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

		// Find the item in the cart
		const foundItemIndex = cartItems.findIndex((item) => item.productId === productId);

		if (foundItemIndex !== -1) {
			// Update the item quantity
			if (newQuantity <= 0) {
				// If new quantity is zero or negative, remove the item from the cart
				cartItems.splice(foundItemIndex, 1);
			} else {
				cartItems[foundItemIndex].quantity = newQuantity;
			}

			localStorage.setItem('cart', JSON.stringify(cartItems));

			// Update cart items and totals
			updateCartItems();
		}
	}

	// Function to delete a cart item by product ID
	function deleteCartItem(productId) {
		const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
		const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
		localStorage.setItem('cart', JSON.stringify(updatedCartItems));
		updateCartItems(); // Update the cart display after deletion
	}

	// Function to generate a random order ID (for simulation purposes)
	function generateOrderId() {
		return Math.floor(Math.random() * 1000000000); // Example random ID generation
	}

	// Event listener for order form submission
	orderForm.addEventListener('submit', async function (event) {
		event.preventDefault(); // Prevent default form submission behavior

		// Validate form fields
		const firstNameInput = document.getElementById('firstName');
		const lastNameInput = document.getElementById('lastName');
		const addressInput = document.getElementById('address');
		const cityInput = document.getElementById('city');
		const emailInput = document.getElementById('email');

		let isValid = true; // Flag to track overall form validation

		if (!validateInput(firstNameInput.value, nameRegex)) {
			displayErrorMessage(firstNameInput, 'Please enter a valid first name.');
			isValid = false;
		} else {
			displayErrorMessage(firstNameInput, ''); // Clear error message if valid
		}

		if (!validateInput(lastNameInput.value, nameRegex)) {
			displayErrorMessage(lastNameInput, 'Please enter a valid last name.');
			isValid = false;
		} else {
			displayErrorMessage(lastNameInput, ''); // Clear error message if valid
		}

		if (!validateInput(emailInput.value, emailRegex)) {
			displayErrorMessage(emailInput, 'Please enter a valid email address.');
			isValid = false;
		} else {
			displayErrorMessage(emailInput, ''); // Clear error message if valid
		}

		if (!validateInput(cityInput.value, cityRegex)) {
			displayErrorMessage(
				cityInput,
				'Please enter a valid city name (only alphabets and spaces allowed).'
			);
			isValid = false;
		} else {
			displayErrorMessage(cityInput, ''); // Clear error message if valid
		}

		// If form is valid, proceed with order submission
		if (isValid) {
			const formData = new FormData(orderForm);
			const orderData = {};
			formData.forEach((value, key) => {
				orderData[key] = value;
			});
			console.log('Order data:', orderData);

			// Simulate order confirmation and redirect to confirmation page
			const orderId = generateOrderId(); // You can replace this with actual order ID from the server
			window.location.href = `confirmation.html?orderId=${orderId}`;
		}
	});
});
