document.addEventListener('DOMContentLoaded', async function () {
	const cartItemsContainer = document.getElementById('cart__items');
	const totalQuantityDisplay = document.getElementById('totalQuantityDisplay');
	const totalPriceElement = document.getElementById('totalPrice');
	const orderForm = document.getElementById('orderForm');
	const orderBtn = document.getElementById('orderBtn');

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
				totalQuantity += item.quantity;
				totalPrice += item.quantity * product.price;

				const cartItem = createCartItemElement(item, product);
				cartItemsContainer.appendChild(cartItem);
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

	// Function to update the quantity of an item in the cart and cart totals
	function updateCartItemQuantity(productId, newQuantity) {
		const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

		// Find the item in the cart and update its quantity
		cartItems.forEach((item) => {
			if (item.productId === productId) {
				item.quantity = newQuantity;
			}
		});

		localStorage.setItem('cart', JSON.stringify(cartItems));

		// Update cart items and totals
		updateCartItems();
	}

	// Function to generate a random order ID (for simulation purposes)
	function generateOrderId() {
		return Math.floor(Math.random() * 1000000000); // Example random ID generation
	}

	// Event listener for order form submission
	orderForm.addEventListener('submit', async function (event) {
		event.preventDefault(); // Prevent default form submission behavior

		// Perform the order submission logic here (e.g., send data to the server)
		// This example just logs the form data to console
		const formData = new FormData(orderForm);
		const orderData = {};
		formData.forEach((value, key) => {
			orderData[key] = value;
		});
		console.log('Order data:', orderData);

		// Simulate order confirmation and redirect to confirmation page
		const orderId = generateOrderId(); // You can replace this with actual order ID from the server
		window.location.href = `confirmation.html?orderId=${orderId}`;
	});
});
