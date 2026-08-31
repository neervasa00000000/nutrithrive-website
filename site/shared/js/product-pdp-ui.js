/** Shared product PDP UI — qty stepper + mobile nav */
window.NT_PDP = window.NT_PDP || {};

window.NT_PDP.setupQty = function () {
  var qtyInput = document.getElementById('product-quantity');
  var minusBtn = document.getElementById('qty-minus');
  var plusBtn = document.getElementById('qty-plus');
  if (!qtyInput || !minusBtn || !plusBtn) return;
  minusBtn.addEventListener('click', function () {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
  });
  plusBtn.addEventListener('click', function () {
    qtyInput.value = Math.min(10, (parseInt(qtyInput.value, 10) || 1) + 1);
  });
};

window.NT_PDP.getQty = function () {
  var el = document.getElementById('product-quantity');
  return parseInt(el ? el.value : '1', 10) || 1;
};

window.NT_PDP.setupHamburger = function () {
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;
  if (!window.ntToggleMenu) {
    window.ntToggleMenu = function () {
      var isOpen = navLinks.classList.contains('nav-active');
      if (isOpen) {
        navLinks.classList.remove('nav-active');
        hamburger.classList.remove('toggle');
        document.body.classList.remove('no-scroll');
        navLinks.style.display = '';
      } else {
        navLinks.classList.add('nav-active');
        hamburger.classList.add('toggle');
        document.body.classList.add('no-scroll');
        navLinks.style.display = 'flex';
      }
    };
  }
  hamburger.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.ntToggleMenu();
  });
};

document.addEventListener('DOMContentLoaded', function () {
  window.NT_PDP.setupQty();
  window.NT_PDP.setupHamburger();
});
