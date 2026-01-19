'use strict';

function getOrderHistory() {
  return JSON.parse(localStorage.getItem('orderHistory')) || [];
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleDateString('en-US', options);
}

function deleteOrder(orderId) {
  if (confirm('Are you sure you want to delete this order?')) {
    let history = getOrderHistory();
    history = history.filter(order => order.orderId !== orderId);

    localStorage.setItem('orderHistory', JSON.stringify(history));
    renderOrderHistory();
  }
}

function clearAllOrders() {
  if (
    confirm(
      'Are you sure you want to delete ALL orders? This cannot be undone!',
    )
  ) {
    localStorage.removeItem('orderHistory');
    renderOrderHistory();
  }
}

function renderOrderHistory() {
  const container = document.getElementById('history-container');
  const history = getOrderHistory();

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        <img src="images/empty-cart.jpg" alt="No orders">
        <p>You haven't placed any orders yet</p>
        <button class="shop-now-btn" onclick="window.location.href='project.html'">
          Start Shopping
        </button>
      </div>
    `;
    return;
  }
  let html = `
    <button class="clear-all-btn" onclick="clearAllOrders()">
      Clear All History
    </button>
  `;
  history.forEach(order => {
    html += `
     <div class="order-card">
     <div class="order-header">
     <div class="order-info">
     <div class="order-info-item">
      <label>Order ID</label>
              <span>${order.orderId}</span>
               </div>
          </div>
          <div class="order-info-item">
              <label>Date</label>
              <span>${formatDate(order.date)}</span>
            </div>
          </div>
          <button class="delete-order-btn" onclick="deleteOrder('${order.orderId}')">
            Delete Order
          </button>
        </div>

        <div class="order-items">
    `;
    Object.values(order.items).forEach(item => {
      const itemTotal = item.price * item.quantity;

      html += `
        <div class="order-item">
          <img src="${item.thumbnail}" alt="${item.title}">
          <div class="item-details">
            <h4>${item.title}</h4>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <span class="item-price">$${itemTotal.toFixed(2)}</span>
        </div>
      `;
    });

    html += `
        </div>

        <div class="order-total">
          <span>Total:</span>
          <strong>$${order.total.toFixed(2)}</strong>
        </div>
    `;

    if (order.delivery) {
      html += `
        <div class="delivery-info">
          <h4>Delivery Address:</h4>
          <p><strong>Name:${order.delivery.fullName}</strong></p>
          <p>Email:${order.delivery.email}</p>
          <p>Phone no:${order.delivery.phone}</p>
          <p>City:${order.delivery.city}</p>
          <p>State:${order.delivery.state}</p>
          <p>Country:${order.delivery.country}</p>
        </div>
      `;
    }
    html += `</div>`;
  });

  container.innerHTML = html;
}
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = 'project.html';
  });
}

document.addEventListener('DOMContentLoaded', renderOrderHistory);
