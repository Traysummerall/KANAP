document.addEventListener('DOMContentLoaded', function () {
	const orderIdElement = document.getElementById('orderId');

	// Function to get the order ID from the query parameter
	function getOrderIdFromURL() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get('orderId');
	}

	// Get the order ID from the URL
	const orderId = getOrderIdFromURL();

	// Display the order ID on the page
	if (orderIdElement && orderId) {
		orderIdElement.textContent = orderId;
	} else {
		console.error('Order ID element or order ID not found.');
	}
});
