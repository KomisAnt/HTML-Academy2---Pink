
let headerLogoWrap = document.querySelector('.header-logo__wrap');
let headerNav = document.querySelector('.header-nav')
let menuClosedToggle = document.querySelector('.header-nav__toggle--menu-closed');
let menuOpenedToggle = document.querySelector('.header-nav__toggle--menu-opened');
let headerNavToggle = document.querySelector('.header-nav__toggle');
let headerNavToggleWrap = document.querySelector('.header-nav__toggle-wrap');

document.querySelector('.header-nav').classList.remove('header-nav--opened');
document.querySelector('.header-nav').classList.add('header-nav--closed');

window.onload = function () {
  headerNavToggle.classList.remove('header-nav__toggle--menu-opened');
  headerNavToggle.classList.add('header-nav__toggle--menu-closed');
  headerLogoWrap.classList.remove('header-logo--nojs');
}

function menuControl() {
  if (headerNavToggle.classList.contains('header-nav__toggle--menu-closed')) {
    headerNavToggle.classList.add('header-nav__toggle--menu-opened');
    headerNavToggle.classList.remove('header-nav__toggle--menu-closed');
    headerNav.style.display = 'block';
    headerLogoWrap.classList.add('header-logo--nojs');
  } else if (headerNavToggle.classList.contains('header-nav__toggle--menu-opened')) {
    headerNavToggle.classList.remove('header-nav__toggle--menu-opened');
    headerNavToggle.classList.add('header-nav__toggle--menu-closed');
    headerNav.style.display = 'none';
    headerLogoWrap.classList.remove('header-logo--nojs');
  }
}

headerNavToggleWrap.addEventListener('click', menuControl);
