(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var category_swiper = new Swiper(".category-carousel", {
      slidesPerView: 6,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".category-carousel-next",
        prevEl: ".category-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 6,
        },
      }
    });

    var brand_swiper = new Swiper(".brand-carousel", {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".brand-carousel-next",
        prevEl: ".brand-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
        1500: {
          slidesPerView: 4,
        },
      }
    });

    var products_swiper = new Swiper(".products-carousel", {
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".products-carousel-next",
        prevEl: ".products-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 6,
        },
      }
    });
  }

  var initProductQty = function(){

    $('.product-qty').each(function(){

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          if(quantity>0){
            $el_product.find('#quantity').val(quantity - 1);
          }
      });

    });

  }

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  // document ready
  $(document).ready(function() {
    
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();

  }); // End of a document

})(jQuery);

// Simple cart store
let cart = [];

function renderCart() {
  const $list = $('#cart-items');
  $list.empty();
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    $list.append(`
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">${item.name}</h6>
          <small class="text-body-secondary">${item.desc}</small>
        </div>
        <span class="text-body-secondary">₹${item.price * item.qty}</span>
      </li>
    `);
  });

  $('#cart-total').text(`₹${total}`);
  $('#cart-count').text(cart.length);
}

$(document).on('click', '.add-to-cart', function (e) {
  e.preventDefault();
  const $product = $(this).closest('.product-item');
  const name = $product.data('name');
  const price = parseFloat($product.data('price'));
  const desc = $product.data('desc');
  const qty = parseInt($product.find('.quantity').val()) || 1;

  // check if item already in cart
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, desc, qty });
  }
  renderCart();
});

// quantity plus/minus logic (already exists, but updated for .quantity)
$('.product-qty').each(function () {
  const $el_product = $(this);
  $el_product.find('.quantity-right-plus').click(function (e) {
    e.preventDefault();
    const $input = $el_product.find('.quantity');
    $input.val(parseInt($input.val()) + 1);
  });
  $el_product.find('.quantity-left-minus').click(function (e) {
    e.preventDefault();
    const $input = $el_product.find('.quantity');
    const val = parseInt($input.val());
    if (val > 1) $input.val(val - 1);
  });
});


// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});


