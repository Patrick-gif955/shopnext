'use strict';

const params = new URLSearchParams(window.location.search);
const category = params.get('category');

// Category modal
let isCartOpen = false;

const activeCategory = document.querySelectorAll('.active');
const overlay = document.getElementById('overlay');
const closeCategory = document.getElementById('close-category');
const categoryModal = document.getElementById('category-modal');

activeCategory.forEach(active =>
  active.addEventListener('click', () => {
    isCartOpen = true;
    overlay.style.display = 'block';
    categoryModal.style.display = 'block';
    menuContent.classList.add('slideRight');

    setTimeout(() => {
      menuContent.classList.add('hidden');
    }, 450);
  })
);

closeCategory.addEventListener('click', () => {
  isCartOpen = false;
  overlay.style.display = 'none';
  categoryModal.style.display = 'none';
});

overlay.addEventListener('click', () => {
  isCartOpen = false;
  overlay.style.display = 'none';
  categoryModal.style.display = 'none';
  successModal.classList.add('hidden');
  successModalContent.classList.add('hidden');
  // menuContent.classList.add('hidden');
  menuContent.classList.add('slideRight');

  setTimeout(() => {
    menuContent.classList.add('hidden');
  }, 450);
});
// responsive menu

const menu = document.querySelector('.menu');
const closeMenu = document.querySelector('.close-menu');
const menuContent = document.querySelector('.menu-content');
menu.addEventListener('click', () => {
  overlay.style.display = 'block';

  menuContent.classList.remove('hidden');
  menuContent.classList.remove('slideRight');
});

closeMenu.addEventListener('click', () => {
  overlay.style.display = 'none';

  menuContent.classList.add('slideRight');

  setTimeout(() => {
    menuContent.classList.add('hidden');
  }, 450);
});

// loading state
const loader = document.querySelector('.loader');

function showloader() {
  loader.classList.remove('hidden');
  overlay.style.display = 'block';
}
function hideloader() {
  loader.classList.add('hidden');
  if (!isCartOpen) {
    categoryModal.style.display = 'none';
    overlay.style.display = 'none';
  }
}

// fetching  products api
const categoryList = document.getElementById('category-list');

async function getProductData() {
  try {
    showloader();
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    console.log(data);
    renderProducts(data.products);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    hideloader();
  }
}

if (category) {
  getProductByCategory(category);
} else {
  getProductData();
}

// fettching category list api

async function getCategoryList() {
  try {
    showloader();
    const response = await fetch(
      'https://dummyjson.com/products/category-list'
    );
    const categories = await response.json();
    console.log(categories);

    categories.forEach(category => {
      const li = document.createElement('li');
      const categoryLink = document.createElement('a');
      categoryLink.href = `project.html?category=${encodeURIComponent(
        category
      )}`;
      categoryLink.textContent = category;
      li.appendChild(categoryLink);
      categoryList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    hideloader();
  }
}

getCategoryList();

// renderproducts used for the dynamic rendering of the webpages

const main = document.querySelector('main');

function renderProducts(products, query = '') {
  main.innerHTML = '';

  // search error display
  if (!products || products.length === 0) {
    main.innerHTML = `<div class="no-results">
    <img src="images/11104.jpg">
    <p> We couldn't find anything for <strong>${searchInput.value}</strong></p>
  <p>Please browse from our categories instead.</p>
  <button id="browse-categories-btn">Browse Categories</button;
  </div>`;

    document
      .getElementById('browse-categories-btn')
      .addEventListener('click', () => {
        overlay.style.display = 'block';
        categoryModal.style.display = 'block';
      });
    return;
  }

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
    <img src="${product.images[0]}" alt="${product.title}" />
    <h2>${product.title}</h2>
    <p> <b>Price:</b> $${product.price}</p>
    <p><b>Category:</b> ${product.category}</p>
    <p>${product.description}</p>

    <div class= "product-actions">
</div>
    `;

    const productActions = productDiv.querySelector('.product-actions');

    updateCartButtons(product, productActions);

    main.appendChild(productDiv);
  });
}

async function getProductByCategory(category) {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/category/${category}`
    );
    const data = await response.json();
    console.log(data);
    renderProducts(data.products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
  }
}

// fetching search api

const searchInput = document.getElementById('search');
const searchButton = document.querySelector('.searchBtn');
function search() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  overlay.style.display = 'none';
  categoryModal.style.display = 'none';

  searchProducts(query);
}
searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    search();
  }
});
searchButton.addEventListener('click', search);

async function searchProducts(query) {
  try {
    showloader();
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    console.log(data);
    renderProducts(data.products);
  } catch (error) {
    console.error('Error searching products:', error);
  } finally {
    hideloader();
  }
}

// add to cart logic

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || {};
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart(product, newQuatity) {
  const cart = getCart();

  if (newQuatity <= 0) {
    delete cart[product.id];
  } else {
    cart[product.id] = {
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: newQuatity,
    };
  }
  saveCart(cart);
  renderCartModal();
  updateCartCount();
}

function refreshProducts() {
  if (category) {
    getProductByCategory(category);
  } else {
    getProductData();
  }
}

// add to cart buttons logic

function updateCartButtons(product, productActions) {
  const cart = getCart();
  const inCart = cart[product.id];
  const currentQty = cart[product.id]?.quantity || 0;
  const productDiv = productActions.parentElement;

  if (currentQty > 0) {
    productDiv.classList.add('cart-border');
  } else {
    productDiv.classList.remove('cart-border');
  }

  if (currentQty === 0) {
    productActions.innerHTML = `<button class="add-to-cart-btn"><svg
                width="45px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3H3.21922L6.78345 17.2569C5.73276 17.7236 5 18.7762 5 20C5 21.6569 6.34315 23 8 23C9.65685 23 11 21.6569 11 20C11 19.6494 10.9398 19.3128 10.8293 19H15.1707C15.0602 19.3128 15 19.6494 15 20C15 21.6569 16.3431 23 18 23C19.6569 23 21 21.6569 21 20C21 18.3431 19.6569 17 18 17H8.78078L8.28078 15H18C20.0642 15 21.3019 13.6959 21.9887 12.2559C22.6599 10.8487 22.8935 9.16692 22.975 7.94368C23.0884 6.24014 21.6803 5 20.1211 5H5.78078L5.15951 2.51493C4.93692 1.62459 4.13696 1 3.21922 1H2ZM18 13H7.78078L6.28078 7H20.1211C20.6742 7 21.0063 7.40675 20.9794 7.81078C20.9034 8.9522 20.6906 10.3318 20.1836 11.3949C19.6922 12.4251 19.0201 13 18 13ZM18 20.9938C17.4511 20.9938 17.0062 20.5489 17.0062 20C17.0062 19.4511 17.4511 19.0062 18 19.0062C18.5489 19.0062 18.9938 19.4511 18.9938 20C18.9938 20.5489 18.5489 20.9938 18 20.9938ZM7.00617 20C7.00617 20.5489 7.45112 20.9938 8 20.9938C8.54888 20.9938 8.99383 20.5489 8.99383 20C8.99383 19.4511 8.54888 19.0062 8 19.0062C7.45112 19.0062 7.00617 19.4511 7.00617 20Z"
                    fill="#Fff"
                  ></path>
                </g></svg
              > Add to Cart</button>`;

    const cartBtn = productActions.querySelector('.add-to-cart-btn');

    cartBtn.addEventListener('click', () => {
      updateCart(product, 1);
      updateCartButtons(product, productActions);
    });
  } else {
    productActions.innerHTML = `<div class="quantity-controls">
    <button class="qty-decrease-btn">-</button>
              <span class="qty-display">${currentQty}</span>
              <button class="qty-increase-btn">+</button>
              </div>`;

    productActions
      .querySelector('.qty-increase-btn')
      .addEventListener('click', () => {
        updateCart(product, currentQty + 1);
        updateCartButtons(product, productActions);
      });

    productActions
      .querySelector('.qty-decrease-btn')
      .addEventListener('click', () => {
        updateCart(product, currentQty - 1);
        updateCartButtons(product, productActions);
      });
  }
}

// cart modal

const cartModal = document.querySelector('.cart-modal');
const cartNav = document.querySelectorAll('.cart-nav');
const cartHeader = document.querySelector('.cart-header');
const closeCartBtn = document.querySelector('.close-cart');

const cartFooter = document.querySelector('.cart-footer');

cartNav.forEach(cartnav =>
  cartnav.addEventListener('click', () => {
    overlay.style.display = 'block';
    cartModal.classList.remove('hidden');
    menuContent.classList.add('slideRight');

    setTimeout(() => {
      menuContent.classList.add('hidden');
    }, 450);
  })
);

closeCartBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
  cartModal.classList.add('hidden');
});

overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
  cartModal.classList.add('hidden');
});

function renderCartModal() {
  const cart = getCart();
  const cartItems = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('#cart-total');
  const emptyCartBtn = document.getElementById('empty-cart-btn');
  const placeOrderBtn = document.querySelector('.checkout-btn');

  placeOrderBtn.addEventListener('click', handlePlaceOrder);

  cartItems.innerHTML = '';
  let total = 0;
  if (Object.keys(cart).length === 0) {
    cartItems.innerHTML = ` <div class ="empty-cart">
    <img src ="images/empty-cart.jpg" alt ="empty-cart img">
    <p> Your cart is empty.</p>
    <button id="empty-cart-btn" class="browse-btn">Browse Categories</button>
    </div>
    `;

    document.querySelector('.browse-btn').addEventListener('click', e => {
      e.stopPropagation();
      overlay.style.display = 'block';
      categoryModal.style.display = 'block';
      cartModal.classList.add('hidden');
    });
    cartTotal.textContent = '$0.00';
    cartFooter.classList.add('hidden');
    return;
  } else {
    Object.values(cart).forEach(item => {
      const totalItem = item.price * item.quantity;
      total += totalItem;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'cartItem';
      itemDiv.innerHTML = `
    <img src = "${item.thumbnail}" alt="${item.title}" />
    <div class="item-details">
    <h3>${item.title}</h3>
    <p><strong>Price:</strong> $${item.price}</p>
    <p><strong>Quantity:</strong> ${item.quantity}</p>
    <p><strong>Total:</strong> $${totalItem.toFixed(2)}</p>
    </div>
     <button class="cart-remove" data-id="${item.id}">✕</button>
    `;
      cartItems.appendChild(itemDiv);
      itemDiv.querySelector('.cart-remove').addEventListener('click', () => {
        updateCart({ id: item.id }, 0);
        refreshProducts();
      });
    });
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartFooter.classList.remove('hidden');
  }
}

function updateCartCount() {
  const cart = getCart();
  const countSpan = document.querySelector('.cart-header h2 span');

  let totalQty = 0;
  Object.values(cart).forEach(item => {
    totalQty += item.quantity;
  });
  countSpan.textContent = totalQty;
}

updateCartCount();

// place order functionality
const successModal = document.querySelector('.success-modal');
const successModalContent = document.querySelector('.success-content');
document
  .querySelector('.continue-shopping-btn')
  .addEventListener('click', () => {
    successModal.classList.add('hidden');
    successModalContent.classList.add('hidden');
    overlay.style.display = 'none';
  });
function handlePlaceOrder() {
  const cart = getCart();
  if (Object.keys(cart).length === 0) return;

  localStorage.removeItem('cart');

  renderCartModal();
  refreshProducts();
  updateCartCount();

  cartModal.classList.add('hidden');
  overlay.style.display = 'block';
  successModal.classList.remove('hidden');
  successModalContent.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  overlay.style.display = 'none';
  categoryModal.style.display = 'none';
  cartModal.classList.add('hidden');

  renderCartModal();
  updateCartCount();
});
