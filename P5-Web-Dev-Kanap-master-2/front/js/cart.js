document.addEventListener('DOMContentLoaded', function () {
	// Function to fetch product details based on product ID
	async function fetchProductDetails(productId) {
		try {
			const response = await fetch(`http://localhost:3000/api/products/${productId}`);
			if (!response.ok) {
				throw new Error(
					`Error fetching product details: ${response.status} ${response.statusText}`
				);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching product details:', error);
			return null;
		}
	}

	// Function to update cart items on the page
	async function updateCartItems() {
		const cartItemsContainer = document.getElementById('cartItemsContainer');
		if (!cartItemsContainer) {
			console.error('Cart items container not found.');
			return;
		}

		// Get cart items from local storage
		const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

		// Clear previous cart items
		cartItemsContainer.innerHTML = '';

		// Loop through cart items and fetch product details to display
		let totalQuantity = 0;
		let totalPrice = 0;
		for (const item of cartItems) {
			console.log('Fetching details for product ID:', item.productId); // Log product ID
			const product = await fetchProductDetails(item.productId);
			if (product) {
				const cartItem = document.createElement('article');
				cartItem.classList.add('cart__item');
				cartItem.innerHTML = `
                    <div class="cart__item__img">
                        <img src="${product.imageUrl}" alt="Product Image" class="productImage" />
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${product.name}</h2>
                            <p>Color: ${item.color}</p>
                            <p>Price: €${product.price}</p>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                `;
				cartItemsContainer.appendChild(cartItem);

				// Update total quantity and price
				totalQuantity += item.quantity;
				totalPrice += item.quantity * product.price;
			}
		}

		// Update total quantity and price on the page
		document.getElementById('totalQuantity').textContent = totalQuantity;
		document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
	}

	// Call updateCartItems when the page loads
	updateCartItems();
});
