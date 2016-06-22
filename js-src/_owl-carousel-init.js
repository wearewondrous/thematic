jQuery(function ($) {
  'use strict';

  var $carousels = $('.owl-carousel');

  // early return, if not in dom
  if (!$carousels.length) {
    return;
  }

  $carousels.owlCarousel({
    loop: true,
    nav: true,
    items: 1,
    center: true,
    autoplay: false
  });
});
