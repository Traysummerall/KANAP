document.addEventListener('DOMContentLoaded', async function () {
	const titleElement = document.getElementById('title');
	const priceElement = document.getElementById('price');
	const descriptionElement = document.getElementById('description');
	const colorSelectElement = document.getElementById('colors');
	const quantityInput = document.getElementById('quantity');
	const addToCartButton = document.getElementById('addToCartBtn');
	const itemImage = document.querySelector('.item__img img');

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

	// Function to render product details on the page
	function updateProductDetails(product) {
		titleElement.textContent = product.name;
		priceElement.textContent = product.price;
		descriptionElement.textContent = product.description;
		itemImage.src = product.imageUrl;
		itemImage.alt = product.altText;

		colorSelectElement.innerHTML = ''; // Clear previous options
		product.colors.forEach((color) => {
			const option = document.createElement('option');
			option.value = color;
			option.textContent = color;
			colorSelectElement.appendChild(option);
		});
	}

	// Function to handle adding product to cart
	function addToCart(product, selectedColor, quantity) {
		// Get existing cart items from local storage or initialize an empty array
		let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

		// Check if the product with the same ID and color is already in the cart
		const existingItemIndex = cartItems.findIndex(
			(item) => item.productId === product._id && item.color === selectedColor
		);

		if (existingItemIndex !== -1) {
			// If the item already exists, update the quantity
			cartItems[existingItemIndex].quantity += quantity;
		} else {
			// If it's a new item, add it to the cart
			cartItems.push({
				productId: product._id,
				name: product.name,
				price: product.price,
				color: selectedColor,
				quantity: quantity,
			});
		}

		// Save the updated cart items back to local storage
		localStorage.setItem('cart', JSON.stringify(cartItems));
		alert('Product added to cart!');
	}

	// Example usage: fetch product details based on product ID from URL
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id'); // Assuming product ID is passed in URL as 'id'

	if (productId) {
		const product = await fetchProductDetails(productId);
		// Update the product details on the page
		updateProductDetails(product);

		// Add event listener to Add to Cart button
		addToCartButton.addEventListener('click', function () {
			const selectedColor = colorSelectElement.value;
			const quantity = parseInt(quantityInput.value);
			addToCart(product, selectedColor, quantity);
		});
	}
});
