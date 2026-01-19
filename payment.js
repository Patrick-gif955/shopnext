'use strict';
alert(
  'You are free to use dummy values to fill in the input fields. It is for testing purposes only.',
);

const cardNumberInput = document.getElementById('card-number');
const expiryInput = document.getElementById('expiry');
const cvvInput = document.getElementById('cvv');
const cardNameInput = document.getElementById('card-name');
const overlay = document.getElementById('overlay');

cardNumberInput.addEventListener('input', e => {
  let value = e.target.value;
  value = value.replace(/\D/g, '');
  value = value.substring(0, 16);
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  e.target.value = value;
});

function validateCardNumber() {
  const value = cardNumberInput.value.replace(/\s/g, '');
  const errorSpan = document.getElementById('card-error');

  if (value.length === 0) {
    errorSpan.textContent = '';
    return false;
  }
  if (value.length !== 16) {
    errorSpan.textContent = 'Card number must be 16 digits';
    return false;
  }
  errorSpan.textContent = '';
  return true;
}

function validateExpiry() {
  const value = expiryInput.value;
  const errorSpan = document.getElementById('expiry-error');

  if (value.length === 0) {
    errorSpan.textContent = '';
    return false;
  }
  if (value.length !== 5) {
    // Must be MM/YY format
    errorSpan.textContent = 'Invalid format (MM/YY)';
    return false;
  }

  const [month, year] = value.split('/');
  const monthNum = parseInt(month);
  const yearNum = parseInt('20' + year);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (
    yearNum < currentYear ||
    (yearNum === currentYear && monthNum < currentMonth)
  ) {
    errorSpan.textContent = 'Card has expired';
    return false;
  }
  errorSpan.textContent = '';
  return true;
}

function validateCVV() {
  const value = cvvInput.value;
  const errorSpan = document.getElementById('cvv-error');

  if (value.length === 0) {
    errorSpan.textContent = '';
    return false;
  }
  if (value.length !== 3) {
    errorSpan.textContent = 'CVV must be 3 digits';
    return false;
  }

  errorSpan.textContent = '';
  return true;
}

function validateCardName() {
  const value = cardNameInput.value.trim();
  const errorSpan = document.getElementById('name-error');

  if (value.length === 0) {
    errorSpan.textContent = 'Cardholder name is required';
    return false;
  }

  if (value.length < 3) {
    errorSpan.textContent = 'Name too short';
    return false;
  }

  errorSpan.textContent = '';
  return true;
}

function validateForm() {
  const isCardValid = validateCardNumber();
  const isExpiryValid = validateExpiry();
  const isCVVValid = validateCVV();
  const isNameValid = validateCardName();

  const payBtn = document.querySelector('.pay-btn');

  if (isCardValid && isExpiryValid && isCVVValid && isNameValid) {
    payBtn.disabled = false;
    payBtn.style.opacity = '1';
    payBtn.style.cursor = 'pointer';
  } else {
    payBtn.disabled = true;
    payBtn.style.opacity = '0.6';
    payBtn.style.cursor = 'not-allowed';
  }
}

cardNumberInput.addEventListener('input', validateForm);
expiryInput.addEventListener('input', validateForm);
cvvInput.addEventListener('input', validateForm);
cardNameInput.addEventListener('input', validateForm);

cardNumberInput.addEventListener('blur', validateCardNumber);
expiryInput.addEventListener('blur', validateExpiry);
cvvInput.addEventListener('blur', validateCVV);
cardNameInput.addEventListener('blur', validateCardName);

expiryInput.addEventListener('input', e => {
  let value = e.target.value;
  value = value.replace(/\D/g, '');
  value = value.substring(0, 4);

  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2);
  }

  e.target.value = value;
});

cvvInput.addEventListener('input', e => {
  let value = e.target.value;
  value = value.replace(/\D/g, '');
  value = value.substring(0, 3);
  e.target.value = value;
});

cardNameInput.addEventListener('input', e => {
  let value = e.target.value;
  value = value.replace(/[^a-zA-Z\s]/g, '');
  value = value.toUpperCase();
  e.target.value = value;
});

validateForm();

// Getting the order summary

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || {};
}

function renderProducts() {
  const aside = document.querySelector('aside');
  const cart = getCart();

  aside.innerHTML = '<h3>Order Summary</h3>';

  let total = 0;

  if (Object.keys(cart).length === 0) {
    aside.innerHTML = `
     <div class ='empty-summary'>
    <img src ="images/empty-cart.jpg" alt ="empty-cart img">
    <p>Your Cart is empty</p>
    <button  class ='browse-btn'>Browse Products </button>
    </div>
    `;
    document.querySelector('.browse-btn').addEventListener('click', () => {
      window.location.href = 'project.html';
    });
    return;
  }

  Object.values(cart).forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    aside.innerHTML += `
        <div class="summary-item">
        <img src='${item.thumbnail}'>
          <p><strong>${item.title}</strong></p>
          <p>Qty: ${item.quantity}</p>
          <p>$${itemTotal.toFixed(2)}</p>
        </div>
      `;
  });
  aside.innerHTML += `
      <hr />
      <p class="summary-total">
        <strong>Total: $${total.toFixed(2)}</strong>
      </p>
    `;
}
const returnBtn = document.querySelector('.return');
if (returnBtn) {
  returnBtn.addEventListener('click', () => {
    window.location.href = 'address.html';
  });
}
// calculating the total price

function calculateTotal(cart) {
  let total = 0;
  Object.values(cart).forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
}

// save order to history
function saveOrder(orderData) {
  const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
  history.unshift(orderData);
  localStorage.setItem('orderHistory', JSON.stringify(history));
}

// Success modal

function showSuccessModal(total) {
  const modal = document.createElement('div');
  modal.className = 'success-modal';

  modal.innerHTML = `
    <div class="success-content">
      <div class="success-icon">✓</div>
      <h2>Payment Successful!</h2>
      <p>Your order has been placed</p>
      <div class="order-total">
        <span>Total Paid:</span>
        <strong>$${total.toFixed(2)}</strong>
      </div>
       <div class="modal-buttons">
        <button class="view-history-btn ">View Order History</button>
        <button class="continue-shopping-btn">Continue Shopping</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.view-history-btn').addEventListener('click', () => {
    window.location.href = 'history.html';
  });

  modal
    .querySelector('.continue-shopping-btn')
    .addEventListener('click', () => {
      window.location.href = 'project.html';
    });
}

// payment function
const paymentForm = document.querySelector('.payment-form');

paymentForm.addEventListener('submit', e => {
  e.preventDefault();
  const cart = getCart();
  const deliveryInfo = getDeliveryInfo();
  const total = calculateTotal(cart);

  if (!deliveryInfo) {
    alert('Please complete delivery information');
    return;
  }

  const order = {
    orderId: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    items: cart,
    delivery: deliveryInfo,
    total: total,
  };

  saveOrder(order);

  localStorage.removeItem('cart');

  showSuccessModal(total);

  overlay.classList.remove('hidden');
});

// address info from local storage

function getDeliveryInfo() {
  return JSON.parse(localStorage.getItem('deliveryInfo')) || null;
}

document.addEventListener('DOMContentLoaded', renderProducts);
