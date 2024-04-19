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

		// Clear previous cart items
		cartItemsContainer.innerHTML = '';

		// Get cart items from local storage
		const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

		// Initialize total quantity and price
		let totalQuantity = 0;
		let totalPrice = 0;

		// Loop through cart items and update quantity input fields
		for (const item of cartItems) {
			const product = await fetchProductDetails(item.productId);
			if (product) {
				totalQuantity += item.quantity;
				totalPrice += item.quantity * product.price;

				if (item.quantity > 0) {
					// Only display items with quantity greater than 0
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
					cartItemsContainer.appendChild(cartItem);
				}
			}
		}

		// Update total quantity and price on the page
		totalQuantityDisplay.textContent = totalQuantity;
		totalPriceElement.textContent = totalPrice.toFixed(2);
	}

	// Call updateCartItems when the page loads
	updateCartItems();

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

	// Event listener for quantity changes
	cartItemsContainer.addEventListener('change', async function (event) {
		if (event.target.classList.contains('itemQuantityInput')) {
			const productId = event.target.dataset.productId;
			let newQuantity = parseInt(event.target.value);

			// Handle zero or negative quantities
			if (newQuantity <= 0) {
				newQuantity = 0; // Set to 0 if zero or negative
				event.target.value = newQuantity; // Update the input field
			}

			// Update the quantity in the cart
			updateCartItemQuantity(productId, newQuantity);

			// Update total quantity and price
			updateCartItems();
		}
	});

	// Function to update the quantity of an item in the cart
	function updateCartItemQuantity(productId, newQuantity) {
		const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

		const updatedCartItems = cartItems.filter((item) => {
			return item.productId !== productId || newQuantity > 0; // Keep items with non-zero quantity
		});

		localStorage.setItem('cart', JSON.stringify(updatedCartItems));
	}

	// Function to generate a random order ID (for simulation purposes)
	function generateOrderId() {
		return Math.floor(Math.random() * 1000000000); // Example random ID generation
	}
});
