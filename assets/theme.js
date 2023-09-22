(function(){
// shopify formate money function
function formatMoney(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};
  
// Announcement Bar Timer 
function announcementTimer(hours, minutes, id, timerContainer) {
  let startTime = localStorage.getItem(`announcementStartTime_${id}`);
  if (!startTime) {
      startTime = Date.now();
      localStorage.setItem(`announcementStartTime_${id}`, startTime);
  }
  const totalMilliseconds = (hours * 3600000) + (minutes * 60000);
  const currentTime = Date.now();
  const timeDifference = currentTime - startTime;
  let remainingMilliseconds = totalMilliseconds - timeDifference;
  if (remainingMilliseconds <= 0) {
      timerContainer.innerHTML = "00 : 00 : 00";
      return;
  }
  const timerInterval = setInterval(function() {
    const remainingHours = Math.floor(remainingMilliseconds / 3600000);
    const remainingMinutes = Math.floor((remainingMilliseconds % 3600000) / 60000);
    const remainingSeconds = Math.floor((remainingMilliseconds % 60000) / 1000);
    timerContainer.innerHTML = `${remainingHours} : ${remainingMinutes} : ${remainingSeconds}`;
    remainingMilliseconds -= 1000;
  }, 1000);
}
document.addEventListener("DOMContentLoaded", function() {
  initAnnouncementTimer();
});
function initAnnouncementTimer() {
  const announcementWrappers = document.querySelectorAll('.announcement__bar');
  announcementWrappers.forEach(wrapper => {
    if (wrapper) {
      const id = wrapper.getAttribute('data-section-id');
      const timerContainer = wrapper.querySelector('.main__timer');
      const hours = timerContainer.getAttribute('data-hour');
      const minutes = timerContainer.getAttribute('data-minutes');
      announcementTimer(hours, minutes, id, timerContainer);
    }
  });
}

// Sticky Header 
function initStickyHeader() {
  const header = document.querySelector('.section__header');
  if (header) {
    const stickyHeader = header.getAttribute('data-sticky-header');
    if (stickyHeader == 'true') {
      let isSticky = false;
      let lastScrollY = 0;
      function updateStickyHeader() {
        const scrollY = window.scrollY;
        if (scrollY > lastScrollY) {
          if (!isSticky) {
            header.classList.add('sticky__header');
            isSticky = true;
          }
        } else {
          if (isSticky && (scrollY <= header.offsetTop || scrollY === 0)) {
            header.classList.remove('sticky__header'); 
            isSticky = false;
          }
        }
        lastScrollY = scrollY;
      }
      window.addEventListener('scroll', updateStickyHeader);
    }
  } 
}
initStickyHeader();

// Header Toggle button
function initHeaderNavigation() {
  let openMenuDrawerBtn = document.querySelector('.menu-toggle__btn');
  let menuDrawer = document.querySelector('.nav-drawer');
  let overlayShadow = document.querySelector('.drawer__overlay-container');
  let closeMenuDrawerBtn = document.querySelector('.nav-icon__close');
  let bodyContainer = document.querySelector('body');

  let menuItem = document.querySelectorAll('.menu-item__link');
  
  if (openMenuDrawerBtn) {
    openMenuDrawerBtn.addEventListener('click', () => {
      openMenuDrawer();
    })
    overlayShadow.addEventListener('click', () => {
      closeMenuDrawer();
    })
    closeMenuDrawerBtn.addEventListener('click', () => {
      closeMenuDrawer();
    })
    function openMenuDrawer() {
      if (menuDrawer.classList.contains('menu-drawer__left')) {
        menuDrawer.classList.add('drawer-open__left');
      } else {
        menuDrawer.classList.add('drawer-open__right');
      }
      overlayShadow.classList.add('overlay__visible');
      bodyContainer.classList.add('drawer__opening');
    }
    function closeMenuDrawer() {
      if (menuDrawer.classList.contains('menu-drawer__left')) {
        menuDrawer.classList.remove('drawer-open__left');
      } else {
        menuDrawer.classList.remove('drawer-open__right');
      }
      overlayShadow.classList.remove('overlay__visible');
      bodyContainer.classList.remove('drawer__opening');
    }
  }

  // Drawer Item Click Function 
  menuItem.forEach(item => {
    if (item) {
      item.addEventListener('click', (event) => {
        let dropdownList = item.closest('.drawer-menu__item').querySelector('.drawer__list');
        let iconArrow = item.querySelector('.icon__arrow');
        if (dropdownList) {
          event.preventDefault();
          dropdownList.classList.toggle('show__dropdown');
          iconArrow.classList.toggle('icon__rotate');
        }
      })
    }
  })
}
initHeaderNavigation();
// Slideshow
function initSlideshowSwipers() {
  // find all the slideshow wrappers on the page
  let slideshowWrapper = document.querySelectorAll('.slideshow');

  slideshowWrapper.forEach(wrapper => {
    let id = wrapper.getAttribute('data-section-id');
    let autoSlides = wrapper.getAttribute('data-auto-slide');
    let slideDuration = parseInt(wrapper.getAttribute('data-slide-duration')) || 2500; // Default value: 2500ms

    let swiperContainer = document.querySelector('#slideshow-' + id);
    if (swiperContainer) {
      // Destroy any previous Swiper instances for this section
      if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy();
      }

      let swiperOptions = {
        slidesPerView: 1,
        navigation: {
          nextEl: ".swiper-button-next.swiper-button-" + id,
          prevEl: ".swiper-button-prev.swiper-button-" + id,
        },
        pagination: {
          el: ".swiper-pagination-" + id + ".swiper-pagination",
          clickable: true,
        },
      };

      // Configure autoplay if enabled
      if (autoSlides === 'true') {
        swiperOptions.autoplay = {
          delay: slideDuration,
          disableOnInteraction: false,
        };
      }

      // Initialize Swiper for this section
      let swiper = new Swiper('#slideshow-' + id, swiperOptions);
    }
  });
}
initSlideshowSwipers();

// Collection List Grid Slider
function initBrandsSwipers() {
  // find all the collection list wrappers in page
  let collectionListWrappers = document.querySelectorAll('.brands__slider');

  collectionListWrappers.forEach(wrapper => {
    let id = wrapper.getAttribute('data-section-id');

    // Check if the Swiper Container exists
    let swiperContainer = document.querySelector('#brands-' + id);
    if (swiperContainer) {
      
      // Destroy any previous Swiper instances for this section
      if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy();
      }

      let swiperOptions = {
        slidesPerView: 1,
        navigation: {
          nextEl: ".swiper-button-next.swiper-button-" + id,
          prevEl: ".swiper-button-prev.swiper-button-" + id,
        },
      }

      // Initialize Swiper for this section
      let swiper = new Swiper('#brands-' + id, swiperOptions);
      
    }
  })
}
initBrandsSwipers();
  
// Collection List Grid Slider
function initCollectionListSwipers() {
  // find all the collection list wrappers in page
  let collectionListWrappers = document.querySelectorAll('.collection-list__wrapper');

  collectionListWrappers.forEach(wrapper => {
    let id = wrapper.getAttribute('data-section-id');

    // Check if the Swiper Container exists
    let swiperContainer = document.querySelector('#collectionListSlider-' + id);
    if (swiperContainer) {
      
      // Destroy any previous Swiper instances for this section
      if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy();
      }

      let swiperOptions = {
        slidesPerView: 2,
        navigation: {
          nextEl: ".swiper-button-next.swiper-button-" + id,
          prevEl: ".swiper-button-prev.swiper-button-" + id,
        },
        pagination: {
          el: ".swiper-pagination.swiper-pagination-" + id,
          clickable: true,
        },
        breakpoints: {
          769: {
            slidesPerView: 3,
          },
          993: {
            slidesPerView: 4,
          }
        },
      }

      // Initialize Swiper for this section
      let swiper = new Swiper('#collectionListSlider-' + id, swiperOptions);
      
    }
  })
}
initCollectionListSwipers();

// Testimonial Slider
function initTestimonialSwipers() {
  // Find all testimonial wrappers on the page
  let testimonialWrappers = document.querySelectorAll('.testimonial__wrapper');

  testimonialWrappers.forEach(wrapper => {
    let id = wrapper.getAttribute('data-section-id');

    // Check if the Swiper container exists in this section
    let swiperContainer = document.querySelector("#testimonials-" + id);
    if (swiperContainer) {
      
      // Destroy any previous Swiper instances for this section
      if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy();
      }

      let swiperOptions = {
        slidesPerView: 1,
        navigation: {
          nextEl: ".swiper-button-next.swiper-button-" + id,
          prevEl: ".swiper-button-prev.swiper-button-" + id,
        },
        autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination.swiper-pagination-" + id,
          clickable: true,
        },
        breakpoints: {
          601: {
            slidesPerView: 2,
          },
          993: {
            slidesPerView: 3,
          },
        },
      };

      // Initialize Swiper for this section
      let swiper = new Swiper('#testimonials-' + id, swiperOptions);
      
    }
  });
}
initTestimonialSwipers();

// Featured Collection Show More Swatches Event
function initFeaturedSwatches() {
  let moreSwatchesBtn = document.querySelectorAll('.show-more__swatches');
  moreSwatchesBtn.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        let hiddenSwatches = btn.closest('.color-swatch__list').querySelector('.hidden__swatches');
        btn.classList.add('hide');
        hiddenSwatches.classList.add('show');
      })
    }
  })
}
initFeaturedSwatches();

// Video Section Events
function initVideoSection() {
  let videoPlayIcon = document.querySelectorAll('.video-section__playicon');
  videoPlayIcon.forEach(button => {
    if (button) {
      button.addEventListener('click', () => {
        const externalVideoContainer = button.closest('.video-section__main').querySelector('.external-video__container');
        const nativeVideoContainer = button.closest('.video-section__main').querySelector('.native-video__container');
        const externalVideo = button.closest('.video-section__main').querySelector('.external-video__container iframe');
        const nativeVideo = button.closest('.video-section__main').querySelector('.native-video__container video');
        const overlayContainer = button.closest('.video-section__content');
        const poster = button.closest('.video-section__main').querySelector('.video__poster');
        function videoPlay() {
          if (externalVideo) {
            poster.style.display = 'none';
            overlayContainer.style.display = 'none';
            externalVideoContainer.classList.remove('video-container__hide');
          } else if (nativeVideo) {
            poster.style.display = 'none';
            overlayContainer.style.display = 'none';
            nativeVideoContainer.classList.remove('video-container__hide');
            nativeVideo.play();
          }
        }
        function videoEnded() {
          if (externalVideo) {
            externalVideo.onended = function() {
              poster.style.display = 'block';
              overlayContainer.style.display = 'table';
              externalVideoContainer.classList.add('video-container__hide');
            };
          } else if (nativeVideo) {
            nativeVideo.onended = function() {
              poster.style.display = 'block';
              overlayContainer.style.display = 'table';
              nativeVideoContainer.classList.add('video-container__hide');
            };
          }
        }
        videoPlay();
        videoEnded();
      });
    }
  });
}
initVideoSection();

// Countdown Timer For Promotional Grid and Product Page
function initCountdown() {
  let countdownWrapper = document.querySelectorAll('[data-countdown]');
  countdownWrapper.forEach(wrapper => {
    countdownCalculate(wrapper);
  })
  function countdownCalculate(wrapper) {
    let years = wrapper.getAttribute('data-year');
    let months = wrapper.getAttribute('data-month');
    let days = wrapper.getAttribute('data-day');
    let hours = wrapper.getAttribute('data-hour');
    let minutes = wrapper.getAttribute('data-minute');
    let timerMessage = wrapper.querySelector('.timer__message');

    let endDate = `${years}-${months}-${days} ${hours}:${minutes}`;
    let targetDate = new Date(endDate).getTime();

    let countdownInterval = setInterval(() => {
        let currentDate = new Date().getTime();
        let timeLeft = targetDate - currentDate;
      
        const day = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hour = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minute = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const second = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
        // Display the countdown
        wrapper.querySelector(".timer__days").innerHTML = day;
        wrapper.querySelector(".timer__hours").innerHTML = hour;
        wrapper.querySelector(".timer__minutes").innerHTML = minute;
        wrapper.querySelector(".timer__seconds").innerHTML = second;
  
        if (timeLeft < 0) {
          clearInterval(countdownInterval);
          wrapper.querySelector(".timer__days").innerHTML = '10';
          wrapper.querySelector(".timer__hours").innerHTML = '12';
          wrapper.querySelector(".timer__minutes").innerHTML = '20';
          wrapper.querySelector(".timer__seconds").innerHTML = '59';
          timerMessage.classList.add('timer-message__visible');
        }
    }, 1000);
  }
}
initCountdown();

// Image Comparison 
function initImageComparison() {
  let compareWrapper = document.querySelectorAll('[data-compare-image]');
  compareWrapper.forEach(wrapper => {
    let compareButton = wrapper.querySelector('.compare__button');
    let compareImageWrapper = wrapper.querySelector('.after__Image');
    let isdraggable = false;
    wrapper.addEventListener('mousemove', () => handleMouserMove(event));
    wrapper.addEventListener('touchmove', () => handleMouseMove(event));
    wrapper.addEventListener('mouseup', () => handleMouseUp());
    wrapper.addEventListener('touchend', () => handleMouseUp());
    wrapper.addEventListener('mouseleave', () => handleMouseLeave());
    wrapper.addEventListener('mousedown', () => handleMouseDown(event));
    wrapper.addEventListener('touchstart', () => handleMouseDown(event));
    function handleMouserMove(event) {
      if (isdraggable) return;
      let sliderLeftX = wrapper.offsetLeft;
      let sliderWidth = wrapper.clientWidth;
      let mouseX = (event.clientX || event.touches[0].clientX) - sliderLeftX;
      if (mouseX < 0) {
        mouseX = 0;
      } else if (mouseX > sliderWidth) {
        mouseX = sliderWidth;
      }
      compareImageWrapper.style.width = `${(1- mouseX/sliderWidth) * 100}%`;
      compareButton.style.left = `${(mouseX/sliderWidth) * 100}%`;
    }
    function handleMouseUp() {
      if (!isdraggable) {
        isdraggable = true;
      }
    }
    function handleMouseLeave() {
      if (isdraggable) {
        isdraggable = false;
      }
    }
    function handleMouseDown(event) {
      if (isdraggable) {
        isdraggable = false;
      }
      handleMouserMove(event)
    }
    
  })
}
initImageComparison();

// Age Verification Popup 
function initageVerificationPopUp() {
  const ageVerifierPopup = document.querySelector('.age-verifier');
  if (ageVerifierPopup) {
      const cookieStorage = {
      getItem: (item) => {
          const cookies = document.cookie
              .split(';')
              .map(cookie => cookie.split('='))
              .reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value }), {});
          return cookies[item];
      },
      setItem: (item, value) => {
          document.cookie = `${item}=${value};`
      }
  }
    const storageType  = cookieStorage;
    const consentPropertyName = 'age-verification-consent';
  
    const shouldShowPopup = () => !storageType.getItem(consentPropertyName);
    const saveToStorage = () => storageType.setItem(consentPropertyName, true);
  
    window.onload = () => {
      const confirmBtn = document.querySelector('.btn__confirm-btn');
      const cancelBtn = document.querySelector('.btn__cancel-btn');
      const returnBackBtn = document.querySelector('.btn__return-btn');
      const popupContent = document.querySelector('.age-verifier__content');
      const declinedContent = document.querySelector('.age-verifier__content-declined');
      
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          saveToStorage(storageType);
          ageVerifierPopup.classList.add('popup__hidden');
        })
      }
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          popupContent.classList.add('content__hidden');
          declinedContent.classList.remove('content__hidden');
        })
      }
      if (returnBackBtn) {
        returnBackBtn.addEventListener('click', () => {
          popupContent.classList.remove('content__hidden');
          declinedContent.classList.add('content__hidden');
        })
      }
      if (shouldShowPopup(storageType)) {
        ageVerifierPopup.classList.remove('popup__hidden');
      }
    }
  }
  
}
initageVerificationPopUp();

// Newsletter Popup
function initNewsletterPopup() {
  const newsletterPopup = document.querySelector('.newsletter-popup');
  if (newsletterPopup) {
    const hidePopupInput = document.querySelector('.show-newsletter__popup input');

    const storageType = localStorage;
    const consentPropertyName = 'newsletter-consent';

    const shouldShowPopup = () => !storageType.getItem(consentPropertyName);
    const saveToStorage = () => storageType.setItem(consentPropertyName, true);

    if (shouldShowPopup(storageType)) {
      newsletterPopup.classList.remove('popup__hidden');
    }
    hidePopupInput.addEventListener('change', () => {
      if (hidePopupInput.checked) {
        saveToStorage(storageType);
      }
    })
  }
}
initNewsletterPopup();

//  General Modal Button Events 
function initModalPopup() {
  let popupModal = document.querySelectorAll('[data-popup-modal]');
  let sizeGuideContainer = document.querySelector('.product__sizeguide');
  let sizeGuidePopup = document.querySelector('.sizeguide-popup')
  popupModal.forEach(popup => {
    let closeModalBtn = popup.querySelector('.close__modal');
    let eventCancelBtn = popup.querySelector('.popup-cancel__btn button');
    let sizeChartBtn = document.querySelector('#sizeChartBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
        closeModalBtn.closest('[data-popup-modal]').classList.add('popup__hidden');
        if (sizeGuideContainer) {
          sizeGuideContainer.classList.remove('sizeguide__overlay');
        }
      })
    }
    if (eventCancelBtn) {
      eventCancelBtn.addEventListener('click', () => {
        eventCancelBtn.closest('[data-popup-modal]').classList.add('popup__hidden');
      })
    }
  })
  if (sizeGuideContainer) {
    sizeGuideContainer.addEventListener('click', () => {
      sizeGuidePopup.classList.toggle('popup__hidden');
        sizeGuideContainer.classList.toggle('sizeguide__overlay');
    })
    if (sizeGuidePopup) {
      sizeGuidePopup.addEventListener('click', (event) => {
        event.stopPropagation();
      })
    }
  }
}
initModalPopup();
  
// Localization Language and Currency Selector 
class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      input: this.querySelector('input[name="language_code"], input[name="country_code"]'),
      button: this.querySelector('button'),
      panel: this.querySelector('ul'),
    };
    this.elements.button.addEventListener('click', this.openSelector.bind(this));
    this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
    this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

    this.querySelectorAll('a').forEach(item => item.addEventListener('click', this.onItemClick.bind(this)));
  }

  hidePanel() {
    this.elements.button.setAttribute('aria-expanded', 'false');
    this.elements.panel.setAttribute('hidden', true);
  }

  onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    this.hidePanel();
    this.elements.button.focus();
  }

  onItemClick(event) {
    event.preventDefault();
    const form = this.querySelector('form');
    this.elements.input.value = event.currentTarget.dataset.value;
    if (form) form.submit();
  }

  openSelector() {
    this.elements.button.focus();
    this.elements.panel.toggleAttribute('hidden');
    this.elements.button.setAttribute('aria-expanded', (this.elements.button.getAttribute('aria-expanded') === 'false').toString());
  }

  closeSelector(event) {
    const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON';
    if (event.relatedTarget === null || shouldClose) {
      this.hidePanel();
    }
  }
}

customElements.define('localization-form', LocalizationForm);

// function currencyFormSubmit(event) {
//   event.target.form.submit();
// }

// document.querySelectorAll('.shopify-currency-form .disclosure__item').forEach(function(element) {
//   element.addEventListener('click', currencyFormSubmit);
// });

// Customers Form
function initCustomerForms() {
  const forgetPasswordBtn = document.querySelector('.forget-password__btn');
  const loginForm = document.querySelector('#loginForm');
  const recoverPasswordForm = document.querySelector('#recoverPasswordForm');
  const formContainer = document.querySelectorAll('[data-form]');
  const passwordShowBtn = document.querySelectorAll('.password__show-btn');
  // const passwordHideBtn = document.querySelectorAll('.password__hide-btn');
  
  formContainer.forEach(form => {
    if (form) {
      const backBtn = form.querySelector('.back__btn');
      if (backBtn) {
        backBtn.addEventListener('click', (event) => {
          event.preventDefault();
          backBtn.closest('[data-form]').classList.add('hidden');
          if (loginForm) {
            loginForm.classList.remove('hidden');
          }
        })
      }
    }
  })
  if (forgetPasswordBtn) {
    forgetPasswordBtn.addEventListener('click', (event) => {
      event.preventDefault();
      loginForm.classList.add('hidden');
      recoverPasswordForm.classList.remove('hidden');
    })
  }

  if (passwordShowBtn) {
    passwordShowBtn.forEach(btn => {
      btn.addEventListener('click', (event) => {
        showPassword(event);
      })
    })
  }
  // if (passwordHideBtn) {
  //   passwordHideBtn.forEach(btn => {
  //     btn.addEventListener('click', (event) => {
  //       hidePassword(event);
  //     })
  //   })
  // }
  
  function customerAddressesForm() {
    const addAddressBtn = document.querySelector('.address-btn__add');
    const editAddressBtn = document.querySelectorAll('.address-btn__edit');
    const deleteAddressBtn = document.querySelectorAll('.address-btn__delete');

    if (addAddressBtn) {
      addAddressBtn.addEventListener('click', () => {
        document.querySelector('#addNewAddressForm').classList.remove('hidden');
      })
    }
    editAddressBtn.forEach(editBtn => {
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          editBtn.closest('.address-grid__item').querySelector('#editAddressForm').classList.remove('hidden');
        })
      }
    })
    deleteAddressBtn.forEach(deleteBtn => {
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (event) => {
          event.preventDefault();
          const deleteFormId = document.getElementById('deleteAddressForm');
          const confirmMessage = deleteBtn.getAttribute('data-confirm-message');
          if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
             deleteFormId.submit();
          }
        })
      }
    })
  }
  customerAddressesForm();

  function showPassword(event) {
    let password = event.target.closest('.password__group').querySelector('input[type="password"]');
    let type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    event.target.closest('.password__group').querySelector('.password__show-btn').classList.toggle('hidden');
    event.target.closest('.password__group').querySelector('.password__hide-btn').classList.toggle('hidden');
  }
  // function hidePassword(event) {
  //   // event.target.closest('.password__group').querySelector('input[type="password"]').setAttribute('type', 'password');
  //   event.target.closest('.password__group').querySelector('.password__show-btn').classList.remove('hidden');
  //   event.target.closest('.password__group').querySelector('.password__hide-btn').classList.add('hidden');
  // }
}
initCustomerForms();

// Collection Sorting
function initCollections() {
  collectionSort();
  collectionFilters();
  function collectionSort() {
    Shopify.queryParams = {};
    // Preserve existing query parameters
    if (location.search.length) {
      var params = location.search.substr(1).split('&');
  
      for (var i = 0; i < params.length; i++) {
        var keyValue = params[i].split('=');
  
        if (keyValue.length) {
          Shopify.queryParams[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
        }
      }
    }
  
    // Update sort_by query parameter on select change
    const sortContainer = document.querySelectorAll('#sort-by');
    if (sortContainer) {
      sortContainer.forEach(el => {
        el.addEventListener('change', function(e) {
          var value = e.target.value;
          Shopify.queryParams.sort_by = value;
          location.search = new URLSearchParams(Shopify.queryParams).toString();
        });
      })
      
    }
  }
  function collectionFilters() {
    let filterItem = document.querySelectorAll('.filter-group__item');
    let filterBtn = document.querySelector('.filter__btn');
    let filterDrawer = document.querySelector('.filter-drawer');
    let overlayShadow = document.querySelector('.drawer__overlay-container');
    let closefilterDrawerBtn = document.querySelector('.filter-icon__close');
    let bodyContainer = document.querySelector('body');
    filterItem.forEach(item => {
        item.addEventListener('click', (event) => {
          event.target.closest('.filter-group').querySelector('.filter-group__dropdown').classList.toggle('hidden');
          event.target.closest('.filter-group').querySelector('.icon__arrow').classList.toggle('icon__rotate');
        })
    })
    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        openFilterDrawer();
      })
      if (overlayShadow) {
        overlayShadow.addEventListener('click', () => {
          closeFilterDrawer();
        })
      }
      if (closefilterDrawerBtn) {
        closefilterDrawerBtn.addEventListener('click', () => {
          closeFilterDrawer();
        })
      }
      function openFilterDrawer() {
        if (filterDrawer.classList.contains('filter-drawer__left')) {
          filterDrawer.classList.add('drawer-open__left');
        } else {
          filterDrawer.classList.add('drawer-open__right');
        }
        overlayShadow.classList.add('overlay__visible');
        bodyContainer.classList.add('drawer__opening');
      }
      function closeFilterDrawer() {
        if (filterDrawer.classList.contains('filter-drawer__left')) {
          filterDrawer.classList.remove('drawer-open__left');
        } else {
          filterDrawer.classList.remove('drawer-open__right');
        }
        overlayShadow.classList.remove('overlay__visible');
        bodyContainer.classList.remove('drawer__opening');
      }
    }
    
  }
}
initCollections();

// FAQ'S Section 
function initHandleQuestions() {
  let questionWrapper = document.querySelectorAll('.faq__wrapper');
  questionWrapper.forEach(wrapper => {
    if (wrapper) {
      let questionBtn = wrapper.querySelectorAll('.faq-question__header');
      questionBtn.forEach(btn => {
        btn.addEventListener('click', (event) => {
          event.target.closest('.faq-question__item').querySelector('.faq-question__dropdown').classList.toggle('hidden');
          event.target.closest('.faq-question__item').querySelector('.icon__plus').classList.toggle('hidden');
          event.target.closest('.faq-question__item').querySelector('.icon__minus').classList.toggle('hidden');
        })
      })
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.faq__item-1 .faq-question__header').click();
      })
    }
  })
}
initHandleQuestions();

// Cart Events
function initHandleCart() {
  let cartBtn = document.querySelector('.icon__cart');
  let cartType = cartBtn.getAttribute('[data-cart-type]');
  let overlayShadow = document.querySelector('.drawer__overlay-container');
  let closeDrawerBtn = document.querySelector('.cart-icon__close');
  let bodyContainer = document.querySelector('body');
  let cartDrawer = document.querySelector('[data-cart-modal]');
  if (cartBtn) {
    cartBtn.addEventListener('click', (event) => {
      if (cartType == 'drawer' || cartType == 'popup') {
        event.preventDefault();
        
      }
      if (cartDrawer) {
        openCartModal();
      }
    })
    if (overlayShadow) {
      overlayShadow.addEventListener('click', () => {
        closeCartModal();
      })
    }
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
          closeCartModal();
      })
    }
    
    function openCartModal(){
      
      if (cartDrawer.classList.contains('cart-drawer__left')) {
        cartDrawer.classList.add('drawer-open__left');
      } else if(cartDrawer.classList.contains('cart-drawer__right')) {
        cartDrawer.classList.add('drawer-open__right');
      } else if (cartDrawer.classList.contains('cart-popup')) {
        cartDrawer.classList.add('open-cart__popup');
      }
      overlayShadow.classList.add('overlay__visible');
      bodyContainer.classList.add('drawer__opening');
    }
    function closeCartModal() {
      if (cartDrawer.classList.contains('cart-drawer__left')) {
        cartDrawer.classList.remove('drawer-open__left');
      } else if(cartDrawer.classList.contains('cart-drawer__right')) {
        cartDrawer.classList.remove('drawer-open__right');
      } else if (cartDrawer.classList.contains('cart-popup')) {
        cartDrawer.classList.remove('open-cart__popup');
      }
      overlayShadow.classList.remove('overlay__visible');
      bodyContainer.classList.remove('drawer__opening');
    }
  }
  let cartNotebtn = document.querySelector('#cartNoteBtn');
  let cartNote = document.querySelector('.cart__note');
  if (cartNotebtn) {
    cartNotebtn.addEventListener('click', () => {
      cartNote.classList.toggle('hidden');
    })
  }
}
initHandleCart();
  
function initcartAjax() {
  let quantityWrapper = document.querySelectorAll('.line__item-quantity');
  let cartForm = document.querySelectorAll('form[action="/cart"]');
  quantityWrapper.forEach(wrapper => {
    let quantityButtons = wrapper.querySelectorAll('.line__item-quantity button');
    quantityButtons.forEach(button => {
      button.addEventListener('click', () => {
        let quantityInput = button.parentElement.querySelector('input');
        // let line = quantityInput.getAttribute('data-line');
        let value = Number(quantityInput.value);
        let isPlus = button.classList.contains('icon__plus');
        let key = button.closest('.cart__item-block').getAttribute('data-key');

        if (isPlus) {
          let newValue = value + 1
          quantityInput.value = newValue;
          changeItemQuantity(key, newValue);
        } else if (value > 1) {
          let newValue = value - 1
          quantityInput.value = newValue;
          changeItemQuantity(key, newValue);
        }
      })
      function updateCart() {
        fetch('/?view=ajax-cart')
        .then(responce => responce.text())
        .then(cartData => {
          cartForm.forEach(form => {
            form.innerHTML = cartData;
          })
        })
      }
      function changeItemQuantity(key, quantity) {
        fetch('/cart/change.js', {
          // key: key,
          // quantity: quantity
          method: 'POST',
          headers: 'applications/json',
          body: JSON.stringify({key: key,quantity: quantity})
        })
        .then(responce => responce.json())
        .then(data => {
          console.log(data);
          let format = document.querySelector('[data-money-format]').getAttribute('data-money-format');
          let totalPrice = formatMoney(data.total_price, format);
          document.querySelector(`.final-line__price`).textContent = data.final_line_price;
          document.querySelector('#total_price').textContent = totalPrice;
        })
      }
    })
  })
}
initcartAjax();

// function for product collapsibles 
function initProductCollapsibles() {
  let collapsibleWrapper = document.querySelectorAll('.product__tabs');
  collapsibleWrapper.forEach(tab => {
    if (tab) {
      let collapsibleHeader = tab.querySelector('.product-tab__header');
      if (collapsibleHeader) {
        collapsibleHeader.addEventListener('click', (event) => {
          event.target.parentElement.querySelector('.product-tab__content').classList.toggle('hidden');
          event.target.querySelector('.icon__arrow').classList.toggle('icon__rotate');
        })
      }
    }
  })
}
initProductCollapsibles();

// function for product Media Sliders
function initProductmediaSlideShow() {
  let productmediaWrapper = document.querySelectorAll('.product-grid');
  let swiperThumbs;
  productmediaWrapper.forEach(wrapper => {
    let id = wrapper.dataset.sectionId;
    let MediaSliderContainer = wrapper.querySelector('#product__media-' + id);
    let ThumbnailSliderContainer = wrapper.querySelector('#product__thumbnail-' + id);
    let thumbnailMediaPosition = wrapper.querySelector('.product-media__grid');
    if (ThumbnailSliderContainer) {
      if (ThumbnailSliderContainer.swiper) {
        ThumbnailSliderContainer.swiper.destroy();
      }
      let thumbsSwiperOptions = {
        slidesPerView: 5,
        spaceBetween: 20,
        watchSlidesProgress: true,
        navigation: {
          nextEl: '.swiper-button-next.swiper-button-' + id,
          prevEl: '.swiper-button-prev.swiper-button-' + id
        },
      }
      if (thumbnailMediaPosition) {
        let thumbnailPosition = thumbnailMediaPosition.dataset.thumbnail;
        if (thumbnailPosition === 'left') {
          thumbsSwiperOptions.direction = "vertical";
          thumbsSwiperOptions.spaceBetween = 10;
          // thumbsSwiperOptions.mousewheel = true;
        }
      }
      
      swiperThumbs = new Swiper(ThumbnailSliderContainer, thumbsSwiperOptions);
    }
    if (MediaSliderContainer) {
      if (MediaSliderContainer.swiper) {
        MediaSliderContainer.swiper.destroy();
      }
      let mediaSwiperOptions = {
        slidesPerView: 1,
        navigation: {
          nextEl: '.swiper-button-next.swiper-button-' + id,
          prevEl: '.swiper-button-prev.swiper-button-' + id
        },
        thumbs: {
          swiper: swiperThumbs
        },
      }
      let mediaSwiper = new Swiper(MediaSliderContainer, mediaSwiperOptions);
    }
  })
}
initProductmediaSlideShow();

// Product Quantity Selectors Event
function initProductQuantitySelector() {
  const quantityWrapper = document.querySelectorAll('.product__item-quantity');
  if (quantityWrapper) {
    const quantityButton = document.querySelectorAll('.product__item-quantity button');
    quantityButton.forEach(button => {
      button.addEventListener('click', () => {
        let quantityInput = button.parentElement.querySelector('input');
        let quantityValue = Number(quantityInput.value);
        const isPlus = button.classList.contains('icon__plus');
        if (isPlus) {
          quantityInput.value = quantityValue + 1;
        } else if(quantityValue > 1) {
          quantityInput.value = quantityValue - 1;
        }
      })
    })
  }
}
initProductQuantitySelector(); 

// Product Variants js
function initProductVariants() {
  // let masterVariantSelector = document.querySelector('.product-selected__variants');
  let masterVariantSelector = document.querySelector('.selected-variant__id');
  let productSalePrice = document.querySelector('[data-sale-price]');
  let productRegularPrice = document.querySelector('[data-regular-price]');
  let productSku = document.querySelector('[data-sku]');
  let productInStock = document.querySelector('[data-availability]');
  let productAddToCartBtn = document.querySelector('[data-add-to-cart]');
  let variantSelectors = document.querySelectorAll('[data-selected-variant]');
  let productForm = document.querySelector('.product__form');
  let format = productForm.dataset.format;
  let product = window.themeContent.routes.product;

  variantSelectors.forEach(selector => {
    selector.addEventListener('change', () => {
      updateProductOptions();
    });
  });

  function updateProductOptions() {
    let selectedOptions = [];

    variantSelectors.forEach(selector => {
      if (selector.type === 'radio' || selector.type === 'checkbox') {
        if (selector.checked) {
          selectedOptions.push(selector.value);
        }
      } else {
        selectedOptions.push(selector.value);
      }
    });

    // Find the matched variant
    let matchedVariant = product.variants.find(variant => {
      return selectedOptions.every(option => variant.options.includes(option));
    });

    if (matchedVariant) {
      updateMasterVariant(matchedVariant);
      updateButtons(matchedVariant);
      updateUrl(matchedVariant);
      updateProductPrice(matchedVariant);
      updateProductSku(matchedVariant);
      updateAvailability(matchedVariant);
      // updateMedia(matchedVariant);
    }
  }

  function updateMasterVariant(matchedVariant) {
    if (!masterVariantSelector) {
      return;
    }
    masterVariantSelector.value = matchedVariant.id;
  }

  function updateUrl(matchedVariant) {
    if (!history.replaceState || !matchedVariant) {
      return;
    }

    var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + matchedVariant.id;
    window.history.replaceState({path: newurl}, '', newurl);
  }

  function updateProductPrice(matchedVariant) {
    productSalePrice.textContent = formatMoney(matchedVariant.price,format);
    productRegularPrice.textContent = formatMoney(matchedVariant.compare_at_price, format);

    matchedVariant.compare_at_price > matchedVariant.price ?
      productRegularPrice.classList.remove('hidden') :
      productRegularPrice.classList.add('hidden');
  }

  function updateProductSku(matchedVariant) {
    productSku.textContent = matchedVariant.sku;
  }

  function updateButtons(matchedVariant) {
    var addButton = document.querySelector('[name="add"]');
    if (matchedVariant.available) {
      addButton.textContent = "Add To Cart";
      addButton.disabled = false;
    } else {
      addButton.textContent = "Sold Out";
      addButton.disabled = true;
    }
  }

  function updateAvailability(matchedVariant) {
    let saleBadge = document.querySelector('sale__badge');
    let soldOutBadge = document.querySelector('.soldout__badge')
    if (matchedVariant.available) {
      saleBadge.classList.remove('hidden');
      soldOutBadge.classList.add('hidden');
    } else {
      saleBadge.classList.add('hidden');
      soldOutBadge.classList.remove('hidden');
    }
  }

  function updateMedia(matchedVariant) {
    $('.prd_img' + matchedVariant.id).click();
    if (matchedVariant.featured_image) {
      document.querySelector('#product-image').setAttribute('src', matchedVariant.featured_image.src);
      document.querySelector('.product_image_thumbs li.selected').classList.remove('selected');
      document.querySelectorAll('.product_image_thumbs li')[matchedVariant.featured_image.position - 1].classList.add('selected');
    }
    if (matchedVariant.featured_image) {
      document.querySelector('.product_image_thumbs li.selected').classList.remove('selected');
      document.querySelectorAll('.product_image_thumbs li')[matchedVariant.featured_image.position - 1].classList.add('selected');
      document.querySelector('.product_image_thumbs li').firstElementChild.setAttribute('src', matchedVariant.featured_image.src);
    }
  }
}

initProductVariants();



// class VariantSelects extends HTMLElement {
//   constructor() {
//     super();
//     this.addEventListener('change', this.onVariantChange);
//   }
//   onVariantChange() {
//     this.updateOptions();
//     this.updateMasterId();
//     this.toggleAddButton(this.currentVariant);
//     // this.updatePickupAvailability();
//     // this.removeErrorMessage();
//     this.updateVariantStatuses();

//     if (!this.currentVariant) {
//       this.toggleAddButton(this.currentVariant);
//       this.setUnavailable();
//     } else {
//       this.updateMedia();
//       this.updateURL();
//       this.updateVariantInput();
//       this.renderProductInfo();
//       // this.updateShareUrl();
//     }
//   }

//   updateOptions() {
//     this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
//   }

//   updateMasterId() {
//     this.currentVariant = this.getVariantData().find((variant) => {
//       return !variant.options
//         .map((option, index) => {
//           return this.options[index] === option;
//         })
//         .includes(false);
//     });
//   }

//   updateMedia() {
//     if (!this.currentVariant) return;
//     if (!this.currentVariant.media) return;

//     const mediaGalleries = document.querySelectorAll(`#product__media-${this.dataset.section}`);
//     mediaGalleries.forEach((mediaGallery) =>
//       mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.media.id}`, true)
//     );

//     // const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
//     // if (!modalContent) return;
//     // const newMediaModal = modalContent.querySelector(`[data-media-id="${this.currentVariant.featured_media.id}"]`);
//     // modalContent.prepend(newMediaModal);
//   }

//   updateURL() {
//     if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
//     window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
//   }

//    updateVariantInput() {
//     const productForms = document.querySelectorAll('.product__form');
//     productForms.forEach((productForm) => {
//       const input = productForm.querySelector('input[name="id"]');
//       input.value = this.currentVariant.id;
//       input.dispatchEvent(new Event('change', { bubbles: true }));
//     });
//   }

//    updateVariantStatuses() {
//     const selectedOptionOneVariants = this.variantData.filter(
//       (variant) => this.querySelector(':checked').value === variant.option1
//     );
//     const inputWrappers = [...this.querySelectorAll('.product-form__input')];
//     inputWrappers.forEach((option, index) => {
//       if (index === 0) return;
//       const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
//       const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
//       const availableOptionInputsValue = selectedOptionOneVariants
//         .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
//         .map((variantOption) => variantOption[`option${index + 1}`]);
//       this.setInputAvailability(optionInputs, availableOptionInputsValue);
//     });
//   }

//   setInputAvailability(listOfOptions, listOfAvailableOptions) {
//     listOfOptions.forEach((input) => {
//       if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
//         input.innerText = input.getAttribute('value');
//       } else {
//         input.innerText = window.variantStrings.unavailable_with_option.replace('[value]', input.getAttribute('value'));
//       }
//     });
//   }

//   renderProductInfo() {
//     const requestedVariantId = this.currentVariant.id;
//     const sectionId = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;

//     fetch(
//       `${this.dataset.url}?variant=${requestedVariantId}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section
//       }`
//     )
//       .then((response) => response.text())
//       .then((responseText) => {
//         // prevent unnecessary ui changes from abandoned selections
//         if (this.currentVariant.id !== requestedVariantId) return;

//         const html = new DOMParser().parseFromString(responseText, 'text/html');
//         const destination = document.querySelector('[data-sale-price]');
//         const source = html.querySelector('[data-sale-price]');
//         const skuSource = html.querySelector('[data-sku]');
//         const skuDestination = document.querySelector('[data-sku]');
//         const inventorySource = html.querySelector('[data-inventory]');
//         const inventoryDestination = document.querySelector('[data-inventory]');

//         // const volumePricingSource = html.querySelector();

//         // const pricePerItemDestination = document.querySelector(`Price-Per-Item-${this.dataset.section}`);
//         // const pricePerItemSource = html.querySelector(`Price-Per-Item-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);

//         // const volumePricingDestination = document.querySelector(`Volume-${this.dataset.section}`);

//         if (source && destination) destination.innerHTML = source.innerHTML;
//         if (inventorySource && inventoryDestination) inventoryDestination.innerHTML = inventorySource.innerHTML;
//         if (skuSource && skuDestination) {
//           skuDestination.innerHTML = skuSource.innerHTML;
//           skuDestination.classList.toggle('visibility-hidden', skuSource.classList.contains('visibility-hidden'));
//         }

//         // if (volumePricingSource && volumePricingDestination) {
//         //   volumePricingDestination.innerHTML = volumePricingSource.innerHTML;
//         // }

//         // if (pricePerItemSource && pricePerItemDestination) {
//         //   pricePerItemDestination.innerHTML = pricePerItemSource.innerHTML;
//         //   pricePerItemDestination.classList.toggle('visibility-hidden', pricePerItemSource.classList.contains('visibility-hidden'));
//         // }

//         const price = document.querySelector('[data-sale-price]');

//         if (price) price.classList.remove('visibility-hidden');

//         if (inventoryDestination)
//           inventoryDestination.classList.toggle('visibility-hidden', inventorySource.innerText === '');

//         const addButtonUpdated = html.querySelector('[name="add"]');
//         this.toggleAddButton(
//           addButtonUpdated ? addButtonUpdated.hasAttribute('disabled') : true,
//           window.themeContent.strings.soldOut
//         );

//         publish(PUB_SUB_EVENTS.variantChange, {
//           data: {
//             sectionId,
//             html,
//             variant: this.currentVariant,
//           },
//         });
//       });
//   }

//   toggleAddButton(currentVariant) {
//     const formid = document.querySelector('.product__form').dataset.sectionId;
//     const productForm = document.querySelector('.product__form');
//     if (!productForm) return;
//     const addButton = productForm.querySelector('[name="add"]');
//     // const addButtonText = productForm.querySelector('[name="add"]');
//     if (!addButton) return;

//     if (currentVariant.available) {
//       addButton.removeAttribute('disabled');
//       addButton.textContent = window.themeContent.strings.addToCart;
//     } else {
//       addButton.setAttribute('disabled', 'disabled');
//       addButton.textContent = window.themeContent.strings.soldOut;
//     }
//   }

//   setUnavailable() {
//     const button = document.querySelector('.product__form');
//     const addButton = button.querySelector('[name="add"]');
//     const price = document.querySelector('[data-sale-price]');
//     const inventory = document.getElementById('[data-inventory]');
//     const sku = document.getElementById('[data-sku]');
//     // const pricePerItem = document.getElementById(`Price-Per-Item-${this.dataset.section}`);

//     if (!addButton) return;
//     addButton.textContent = window.variantStrings.unavailable;
//     if (price) price.classList.add('visibility-hidden');
//     if (inventory) inventory.classList.add('visibility-hidden');
//     if (sku) sku.classList.add('visibility-hidden');
//     if (pricePerItem) pricePerItem.classList.add('visibility-hidden');
//   }

//   getVariantData() {
//     this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
//     return this.variantData;
//   }
  
// }
// customElements.define('variant-selects', VariantSelects);
  
// class VariantRadios extends VariantSelects {
//   constructor() {
//     super();
//   }

//   setInputAvailability(listOfOptions, listOfAvailableOptions) {
//     listOfOptions.forEach((input) => {
//       if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
//         input.classList.remove('disabled');
//       } else {
//         input.classList.add('disabled');
//       }
//     });
//   }

//   updateOptions() {
//     const fieldsets = Array.from(this.querySelectorAll('fieldset'));
//     this.options = fieldsets.map((fieldset) => {
//       return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
//     });
//   }
// }

// customElements.define('variant-radios', VariantRadios);


// Product Recommendations
function initProductRecommendations() {
  const productRecommendationContainer = document.querySelectorAll('product-recommendations');
  if (productRecommendationContainer) {
    productRecommendationContainer.forEach(container => {
      const intent = container.getAttribute('data-intent');
      const sectionId = container.getAttribute('data-section-id');
      const productId = container.getAttribute('data-product-id');
      const recommendationsCount = container.getAttribute('data-limit');
      async function fetchData() {
        try {
          const response = await fetch(`${window.themeContent.routes.productRecommendation}?section_id=${sectionId}&product_id=${productId}&limit=${recommendationsCount}&intent=${intent}`);
          if (response.ok) {
            const data = await response.text();
            return data;
          } else {
            console.error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
            return null;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          return null;
        }
      }
      async function replaceContent() {
        const data = await fetchData();
        if (data !== null) {
          container.innerHTML = data;
        }
      }
      replaceContent();
    })
  }
}
initProductRecommendations();
})();
