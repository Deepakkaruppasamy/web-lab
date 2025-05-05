// Load cart items and display them in the cart table
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartTableBody = document.getElementById("cart-items");
    const totalCartPrice = document.getElementById("total-cart-price");

    cartTableBody.innerHTML = ""; // Clear existing rows

    if (cartItems.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>';
        totalCartPrice.textContent = "₹0.00";
        return;
    }

    let totalPrice = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${index}, 1)">+</button>
            </td>
            <td>₹${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    totalCartPrice.textContent = `₹${totalPrice.toFixed(2)}`;
}

// Update item quantity in the cart
function updateQuantity(index, change) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems[index].quantity += change; 

    if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadCart(); // Refresh cart
}

// Remove an item from the cart
function removeFromCart(index) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.splice(index, 1);

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadCart(); // Refresh cart
}

// Clear the entire cart
document.getElementById("clear-cart").addEventListener("click", function () {
    localStorage.removeItem("cartItems");
    loadCart(); // Refresh cart
});

// Proceed to checkout
document.getElementById("checkout").addEventListener("click", function () {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length === 0) {
        alert("Your cart is empty. Add items before proceeding to checkout!");
        return;
    }

    // Save cart items for checkout page
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems));

    // Redirect to the checkout page
    window.location.href = "checkout.html";
});
