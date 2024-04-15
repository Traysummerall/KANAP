// Function to fetch products from the backend API using the Fetch API
async function fetchProducts() {
	try {
		const response = await fetch('http://localhost:3000/api/products');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const products = await response.json();
		console.log({ products });
		return products;
	} catch (error) {
		console.error('Error fetching products:', error.message);
		return []; // Return an empty array in case of error
	}
}

// Function to render products in the HTML
function renderProducts(products) {
	const productContainer = document.getElementById('productContainer');
	if (!productContainer) {
		console.error('Product container not found');
		return;
	}
	productContainer.innerHTML = ''; // Clear previous content

	// Loop through each product and create HTML elements
	products.forEach((product) => {
		const productElement = document.createElement('div');
		productElement.classList.add('product');
		productElement.innerHTML = `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altText}" />
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
        `;
		productContainer.appendChild(productElement);
	});
}

// Call fetchProducts and render products when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
	try {
		// Fetch products from the backend API
		const products = await fetchProducts();

		// Render products in the HTML
		renderProducts(products);
	} catch (error) {
		console.error('Error loading products:', error.message);
		// Handle the error (e.g., display a message to the user)
	}
});
