'use strict';
alert('You are free to use a dummy/fake address for testing purposes.');
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || {};
}

function renderAddressCart() {
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
    window.location.href = 'project.html';
  });
}

const form = document.querySelector('form');
const paymentBtn = document.querySelector('.payment');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('telephone');
const cityInput = document.getElementById('city');
const state = document.getElementById('state');
const countrySelect = document.getElementById('country');

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm() {
  const isNameFilled = nameInput.value.trim() !== '';
  const isEmailValid =
    emailInput.value.trim() !== '' && isValidEmail(emailInput.value);
  const isPhoneFilled = phoneInput.value.trim() !== '';
  const isCityFilled = cityInput.value.trim() !== '';
  const stateFilled = state.value !== '';
  const isCountrySelected = countrySelect
    ? countrySelect.value.trim() !== ''
    : true;

  if (
    isNameFilled &&
    isEmailValid &&
    isPhoneFilled &&
    isCityFilled &&
    stateFilled &&
    isCountrySelected
  ) {
    paymentBtn.disabled = false;
    paymentBtn.style.opacity = '1';
    paymentBtn.style.cursor = 'pointer';
    paymentBtn.addEventListener('click', () => {});
  } else {
    paymentBtn.disabled = true;
    paymentBtn.style.opacity = '0.5';
    paymentBtn.style.cursor = 'not-allowed';
  }
}

emailInput.addEventListener('blur', () => {
  if (emailInput.value.trim() !== '' && !isValidEmail(emailInput.value)) {
    emailInput.setCustomValidity('Please enter a valid email address');
    emailInput.reportValidity();
  } else {
    emailInput.setCustomValidity('');
  }
});

nameInput.addEventListener('input', validateForm);
emailInput.addEventListener('input', validateForm);
phoneInput.addEventListener('input', validateForm);
cityInput.addEventListener('input', validateForm);
state.addEventListener('input', validateForm);
if (countrySelect) countrySelect.addEventListener('input', validateForm);

validateForm();

form.addEventListener('submit', e => {
  if (!form.checkValidity()) {
    e.preventDefault();
    form.reportValidity();

    return;
  }
  e.preventDefault();
  const deliveryInfo = {
    fullName: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('telephone').value.trim(),
    city: document.getElementById('city').value.trim(),
    state: document.getElementById('state').value.trim(),
    country: document.getElementById('country').value,
    orderDate: new Date().toISOString(),
  };
  localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
  console.log('Delivery info saved:', deliveryInfo);
  window.location.href = 'payment.html';
});

document.addEventListener('DOMContentLoaded', renderAddressCart);
