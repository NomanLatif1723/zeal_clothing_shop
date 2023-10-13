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
  if (window.matchMedia("(max-width: 768px)").matches) {
    menuItem.forEach(item => {
      if (!item) {
        return;
      }
      item.addEventListener('click', (event) => {
        let dropdownList = item.closest('.drawer-menu__item').querySelector('.drawer__list');
        let iconArrow = item.querySelector('.icon__arrow');
        if (!dropdownList || !iconArrow) {
          return;
        }
        event.preventDefault();
        dropdownList.classList.toggle('show__dropdown');
        iconArrow.classList.toggle('icon__rotate');
      })
    })
  }
}
initHeaderNavigation();

// Header Search Events
function initHeaderSearch() {
  let selectors = {
    searchIcon: document.querySelectorAll('.icon__search'),
    searchContainer: document.querySelector('.site-search__container'),
    searchBox: document.querySelector('.site-search__wrapper'),
    closeIcon: document.querySelectorAll('#close__search-modal')
  };
  if (!selectors.searchContainer || !selectors.searchBox) {
    return;
  }
  selectors.searchContainer.addEventListener('click', () => {
    selectors.searchContainer.classList.add('hidden');
  });
  selectors.searchBox.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  selectors.searchIcon.forEach(button => {
    if (!button) {
      return;
    }
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (!selectors.searchContainer) {
        return;
      }
      selectors.searchContainer.classList.remove('hidden');
    });
  });
  selectors.closeIcon.forEach(button => {
    if (!button) {
      return;
    }
    button.addEventListener('click', () => {
      if (!selectors.searchContainer) {
        return;
      }
      selectors.searchContainer.classList.add('hidden');
    });
  });
}
initHeaderSearch();

// Predictive Search 
class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('#predictive__input');
    this.predictiveSearchResults = this.querySelector('#PredictiveResults');

    if (!this.input) {
      return;
    }
    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));
  }

  onChange() {
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        if (!this.predictiveSearchResults) {
          return;
        }
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    this.predictiveSearchResults.classList.remove('hidden');
  }

  close() {
    this.predictiveSearchResults.classList.add('hidden');
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define('predictive-search', PredictiveSearch);

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
    const closeModal = document.querySelectorAll('.edit-close__btn');

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
    closeModal.forEach(button => {
      if (!button) return;
      button.addEventListener('click', () => {
        button.closest('#editAddressForm').classList.add('hidden')
      })
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
// function initCustomerForms() {
//   let selectors = {
//     forgetPasswordBtn: document.querySelector('.forget-password__btn'),
//     loginForm: document.querySelector('#loginForm'),
//     recoverPasswordForm: document.querySelector('#recoverPasswordForm'),
//     formContainer: document.querySelectorAll('[data-form]'),
//     passwordShowBtn: document.querySelectorAll('.password__show-btn'),
//     passwordHideBtn: document.querySelectorAll('.password__hide-btn'),
//     addAddressBtn: document.querySelector('.address-btn__add'),
//     editAddressBtn: document.querySelectorAll('.address-btn__edit'),
//     deleteAddressBtn: document.querySelectorAll('.address-btn__delete'),
//     newAddressForm: document.querySelector('#addNewAddressForm'),
//     deleteForm: document.querySelectorAll('#deleteAddressForm')
//   };
  
//   selectors.formContainer.forEach(form => {
//     if (!form) return;
//     const backBtn = form.querySelector('.back__btn');
//     if (!backBtn) return;
//     backBtn.addEventListener('click', (event) => {
//       event.preventDefault();
//       backBtn.closest('[data-form]').classList.add('hidden');
//       if (!selectors.loginForm) return;
//       selectors.loginForm.classList.remove('hidden');
//     });
//   });
  
//   if (!selectors.forgetPasswordBtn) return;
//   selectors.forgetPasswordBtn.addEventListener('click', (event) => {
//     event.preventDefault();
//     selectors.loginForm.classList.add('hidden');
//     selectors.recoverPasswordForm.classList.remove('hidden');
//   });

//   selectors.passwordShowBtn.forEach(btn => {
//     if (!btn) return;
//     btn.addEventListener('click', (event) => {
//       showPassword(event);
//     });
//   });

//   selectors.passwordHideBtn.forEach(btn => {
//     if (!btn) return;
//     btn.addEventListener('click', (event) => {
//       hidePassword(event);
//     });
//   });
  
//   if (!selectors.addAddressBtn) return;
//     selectors.addAddressBtn.addEventListener('click', () => {
//       console.log("hy");
//       selectors.newAddressForm.classList.remove('hidden');
//     })
//   selectors.editAddressBtn.forEach(editBtn => {
//     if (!editBtn) return;
//       editBtn.addEventListener('click', () => {
//       editBtn.closest('.address-grid__item').querySelector('#editAddressForm').classList.remove('hidden');
//     });
//   });
//   // selectors.deleteAddressBtn.forEach(deleteBtn => {
//   //   if (deleteBtn) return;
//   //   deleteBtn.addEventListener('click', (event) => {
//   //     event.preventDefault();
//   //     const deleteFormId = document.getElementById('deleteAddressForm');
//   //     const confirmMessage = deleteBtn.getAttribute('data-confirm-message');
//   //     if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
//   //        deleteFormId.submit();
//   //     }
//   //   })
//   // })
//   selectors.deleteForm.forEach(form => {
//     if (!form) return;
//     form.addEventListener('click', (event) => {
//       event.preventDefault();
//       const confirmMessage = deleteBtn.getAttribute('data-confirm-message');
//       if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
//          form.submit();
//       }
//     });
//   });

//   function showPassword(event) {
//     let password = event.target.closest('.password__group').querySelector('input[type="password"]');
//     let type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//     password.setAttribute('type', type);
//     event.target.closest('.password__group').querySelector('.password__show-btn').classList.toggle('hidden');
//     event.target.closest('.password__group').querySelector('.password__hide-btn').classList.toggle('hidden');
//   }
//   function hidePassword(event) {
//     // event.target.closest('.password__group').querySelector('input[type="password"]').setAttribute('type', 'password');
//     event.target.closest('.password__group').querySelector('.password__show-btn').classList.remove('hidden');
//     event.target.closest('.password__group').querySelector('.password__hide-btn').classList.add('hidden');
//   }
// }
// initCustomerForms();

// initFilterFacetForm();

// Document General Event Listeners
function initCollectionEventListeners() {
  let selectors = {
    loader: document.querySelector('.loader'),
    filterDrawer: document.querySelector('.filter-drawer'),
    bodyContainer: document.querySelector('body'),
    filterItem: document.querySelectorAll('.filter-group__item'),
    filterSortBtn: document.querySelector('.filter__btn'),
    filterIconClose: document.querySelector('.filter-icon__close'),
    filterDrawerBox: document.querySelector('.filter-drawer__box'),
    ShowMoreSwatches: document.querySelectorAll('.show-more__swatches'),
    removeActiveFilters: document.querySelectorAll('.active-filters__remove-filter'),
  }
  selectors.filterItem.forEach(item => {
    if (!item) return;
    item.addEventListener('click', () => {
      item.closest('.filter-group').querySelector('.filter-group__dropdown').classList.toggle('hidden');
      item.closest('.filter-group').querySelector('.icon__arrow').classList.toggle('icon__rotate');
    });
  });

  if (!selectors.filterSortBtn) return;
  selectors.filterSortBtn.addEventListener('click', () => {
    openFilterDrawer();
  });

  if (!selectors.filterIconClose) return;
  selectors.filterIconClose.addEventListener('click', () => {
    closeFilterDrawer();
  });

  if (!selectors.filterDrawer) return;
  selectors.filterDrawer.addEventListener('click', () => {
    closeFilterDrawer();
  });

  if (!selectors.filterDrawerBox) return;
  selectors.filterDrawerBox.addEventListener('click', (event) => {
     event.stopPropagation();
  });

  selectors.ShowMoreSwatches.forEach(swatch => {
    if (!swatch) return;
    swatch.addEventListener('click', () => {
      let colorSwatchList = event.target.closest('.color-swatch__list');
      if (colorSwatchList) {
        let hiddenSwatches = colorSwatchList.querySelector('.hidden__swatches');
        if (hiddenSwatches) {
          event.target.classList.add('hide');
          hiddenSwatches.classList.add('show');
        }
      }
    });
  });

  // selectors.removeActiveFilters.forEach(button => {
  //   if (!button) return;
  //   button.addEventListener('click', (event) => {
  //     event.preventDefault();
  //     const filterName = event.target.getAttribute('data-filter-name');
  //     const filterValue = event.target.getAttribute('data-filter-value');
  //     removeFilterAjax(filterName, filterValue);
  //   });
  // });
  // Open Filter Drawer Function
  function openFilterDrawer() {
    if (selectors.filterDrawer.classList.contains('filter-drawer__left')) {
      selectors.filterDrawer.classList.add('drawer-open__left');
    } else {
      selectors.filterDrawer.classList.add('drawer-open__right');
    }
    selectors.bodyContainer.classList.add('drawer__opening');
  }
  // Close Filter Drawer Function
  function closeFilterDrawer() {
    if (selectors.filterDrawer.classList.contains('filter-drawer__left')) {
      selectors.filterDrawer.classList.remove('drawer-open__left');
    } else {
      selectors.filterDrawer.classList.remove('drawer-open__right');
    }
    selectors.bodyContainer.classList.remove('drawer__opening');
  }
}
initCollectionEventListeners();

// Collection Sorting Using Ajax
function initCollectionSort() {
  let selectors = {
    sortContainer: document.querySelectorAll('#sort-by'),
    loader: document.querySelector('.loader'),
    filterForm: document.querySelector('.filter-form'),
    collectionContainer: document.querySelector('.collection-grid')
  }
  Shopify.queryParams = {};
  if(!selectors.sortContainer || !selectors.loader) return;
  selectors.sortContainer.forEach(el => {
    el.addEventListener('change', function(event) {
      sortingSubmitForm(event);
      updateUrl(event);
    });
    function sortingSubmitForm(event) {
      selectors.loader.classList.remove('hidden');
      const sortValue = event.target.value;
      const filterParams = new URLSearchParams(new FormData(selectors.filterForm)).toString();
      let value = event.target.value;
      
      fetch(`${window.themeContent.routes.collection}?${filterParams}&sort_by=${sortValue}`)
      .then(responce => responce.text())
      .then(data => {
        let html = document.createElement('div');
        html.innerHTML = data;
        let productData = html.querySelector('.collection-grid').innerHTML;
        selectors.collectionContainer.innerHTML = productData;
        initCollectionEventListeners();
      })
      .catch(error => console.log('Error', error))
      .finally(() => selectors.loader.classList.add('hidden'));
    }
    function updateUrl(event) {
      const currentSortValue = event.target.value;
      const currentFilterParams = new URLSearchParams(new FormData(selectors.filterForm)).toString();
      const newUrl = window.location.pathname + '?' + currentFilterParams + '&sort_by=' + currentSortValue;
      history.replaceState(null, null, newUrl);
    }
  })
}
initCollectionSort();

// Collection Facets Filters 
function initFilterFacetForm() {
  let selectors = {
    loader: document.querySelector('.loader'),
    filterForm: document.querySelector('.filter-form'),
    filterOptions: document.querySelectorAll('.filter-group input[type="checkbox"]'),
    filterPriceOptions: document.querySelectorAll('.filter-group input[type="number"]')
  }
  selectors.filterOptions.forEach(option => {
    if (!option) return;
    option.addEventListener('change', () => {
      filterSubmitForm();
    });
  });
  selectors.filterPriceOptions.forEach(option => {
    if (!option) return;
    option.addEventListener('input', () => {
      filterSubmitForm();
    });
  });
  function filterSubmitForm() {
    const queryString = new URLSearchParams();
    selectors.filterOptions.forEach(option => {
      if (option.checked) {
        queryString.append(option.name, option.value);
      }
    });
    selectors.filterPriceOptions.forEach(option => {
      const priceValue = option.value.trim();
      if (priceValue !== '') {
        queryString.set(option.name, priceValue);
      }
    });
    // Show Loader 
    selectors.loader.classList.remove('hidden');
    fetch(`${window.themeContent.routes.collection}?${queryString}`)
      .then(responce => responce.text())
      .then(data => {
        let html = document.createElement('div');
        html.innerHTML = data;
        let productData = html.querySelector('.catalog__content').innerHTML;
        document.querySelector('.catalog__content').innerHTML = productData;

        // Check if there are no products
        const noProductsMessage = html.querySelector('.empty-products__message');
        if (noProductsMessage) {
          document.querySelector('.empty-products__message').classList.remove('hidden');
        } else {
          // Preserve existing sorting parameters
          const existingSortParam = new URLSearchParams(window.location.search).get('sort_by');
          if (existingSortParam) {
            queryString.set('sort_by', existingSortParam);
          }
          history.replaceState(null, null, '?' + queryString.toString());
          initCollectionEventListeners();
          initCollectionSort();
        }
      })
      .catch(error => console.log('Error', error))
      .finally(() => selectors.loader.classList.add('hidden'));
  }
}
initFilterFacetForm();
  
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

// Cart Form Ajax
function initCartForm() {
  let selectors = {
    quantitySelector: document.querySelectorAll('.line__item-quantity button'),
    removeButton: document.querySelectorAll('.cart__item-remove'),
    cartContainer: document.querySelectorAll('[data-cart]'),
    cartForm: document.querySelectorAll('#cart_form'),
    subTotal: document.querySelectorAll('[data-subTotal]'),
    totalDiscount: document.querySelectorAll('[data-discount]'),
    cartNoteBtn: document.querySelectorAll('#cartNoteBtn'),
    cartNote: document.querySelectorAll('[name="note"]'),
    freeShippingBar: document.querySelectorAll('.free-shipping'),
    cartItemCounter: document.querySelectorAll('[data-cart-count]'),
    format: null
  };

  // Get the Money Format
  selectors.cartContainer.forEach(container => {
    if (!container) {
      return;
    }
    if (container) {
      selectors.format = container.dataset.moneyFormat;
    } else {
      selectors.format = 'default';
    }
  });

  // quantity Change Event
  selectors.quantitySelector.forEach(button => {
    if (!button) {
      return;
    }
    button.addEventListener('click', (event) => {
      let isPlus = button.classList.contains('icon__plus');
      let quantityInput = button.parentElement.querySelector('input');
      let value = Number(quantityInput.value);
      let key = button.closest('[data-key]').dataset.key;
      
      const cartLineItem = button.closest('[data-key]');
      const stockAvailable = cartLineItem.dataset.stockCount;
      if (isPlus) {
        let newQuantity = value + 1;
        if (newQuantity <= stockAvailable) {
          quantityInput.value = newQuantity;
          updateCart(key, newQuantity);
        } 
      } else {
        let newQuantity = value - 1;
        if (newQuantity > 0) {
          quantityInput.value = newQuantity;
          updateCart(key, newQuantity);
        }
      }
    });
  });

  // remove Button Event
  selectors.removeButton.forEach(button => {
    if (!button) {
      return
    }
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const itemToRemove = button.closest('[data-key]');
      const key = itemToRemove.dataset.key;
      removeItem(key,0,itemToRemove);
    });
  });

  // cartNote change Event
  selectors.cartNoteBtn.forEach(button => {
    if (!button) {
      return;
    }
    button.addEventListener('click', () => {
      button.closest('[data-cart]').querySelector('.cart__note').classList.toggle('hidden');
    });
  });
  
  selectors.cartNote.forEach(note => {
    if (!note) {
      return;
    }
    note.addEventListener('keyup', (event) => {
      updateCartNote(event);
    });
  });
  
  // Checkout Form Submit
  selectors.cartForm.forEach(form => {
    const termsEnabled = form.querySelector('[data-checkout-terms]');
    const checkoutButton = form.querySelector('[name="checkout"]');
    const checkedInput = form.querySelector('[data-checkout-terms] input');
    if (!termsEnabled || !checkoutButton || !checkedInput) {
      return;
    }
    if (termsEnabled) {
      checkoutButton.addEventListener('click', (event) => {
        formSubmit(event,checkedInput);
      });
    }
  });

  function updateCart(key,quantity) {
    var requestData = {
      id: key,
      quantity: quantity
    };
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(requestData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(cartData) {
      updateLineItemPrices(cartData.items);
      updateSubtotal(cartData);
      updateTotalDiscount(cartData);
      updateCartCount(cartData);
      updateSippingBar(cartData)
    })
    .catch(function(error) {
      console.error('Error updating cart:', error);
    });
  }

  function removeItem(key, quantity, itemToRemove) {
    var requestData = {
        id: key,
        quantity: 0,
        itemToRemove: itemToRemove
      };
      fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestData)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(cartData) {
        removeLineItem(cartData.items,itemToRemove);
        updateSubtotal(cartData);
        updateTotalDiscount(cartData);
        updateCartCount(cartData);
        updateSippingBar(cartData);
      })
      .catch(function(error) {
        console.error('Error updating cart:', error);
      });
  }
  
  function updateLineItemPrices(items) {
    items.forEach((item) => {
      if (!item) {
        return;
      }
      let finalPriceContainer = document.querySelectorAll(`[data-key="${item.key}"] .final-line__price`);
      let itemPrice =  formatMoney(item.final_line_price,selectors.format);
      finalPriceContainer.forEach(lineItem => { lineItem.textContent = itemPrice});
    });
  }

  function updateSubtotal(cartData) {
    selectors.subTotal.forEach(selector => {
      if (!selector) {
        return;
      }
      selector.textContent = formatMoney(cartData.total_price,selectors.format);
    })
  }

  function updateTotalDiscount(cartData) {
    selectors.totalDiscount.forEach(selector => {
      if (!selector) {
        return
      }
      selector.textContent = formatMoney(cartData.total_discount,selectors.format);
    })
  }

  function updateCartNote(event) {
    var requestData = {
      note: event.target.value
    };
    fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(requestData)
    });
  }

  function updateCartCount(cartData) {
    selectors.cartItemCounter.forEach(counter => {
      if (!counter) {
        return;
      }
      if (cartData.item_count > 0) {
        
        counter.textContent = cartData.item_count;
        counter.classList.remove('hidden');
      } else {
        counter.remove();
      }
    })
  }

  function formSubmit(event,checkedInput) {
    if (!checkedInput) {
      return;
    }
    if (checkedInput.checked) {
      // Proceed to Checkout
    } else {
      alert(window.themeContent.strings.cartTermsConfirmation);
      event.preventDefault();
    }
  }

  function removeLineItem(items,itemToRemove) {
    selectors.cartContainer.forEach(container => {
      if (!container) {
        return;
      }
      const freeShippingBar = container.querySelector('.free-shipping');
      const cartForm = container.querySelector('#cart_form');
      const emptyCart = document.createElement('div');
      emptyCart.className = 'cart__empty-message';
      emptyCart.innerHTML = `
        <div class="rte">${window.themeContent.strings.cartEmptyMessage}</div>
        <a href="${window.themeContent.routes.all_collections}" title="${window.themeContent.strings.continue_shopping}" class="form__links">${window.themeContent.strings.continue_shopping}</a>
      `;
      if (items.length === 0) {
        if(!freeShippingBar || !cartForm){
          return;
        }
        freeShippingBar.remove();
        cartForm.remove();
        container.appendChild(emptyCart);
      } else {
        itemToRemove.remove();
      }
    })
  }

  function updateSippingBar(cartData) {
    selectors.freeShippingBar.forEach(bar => {
      const thresholdTotal = bar.dataset.freeShippingThreshold;
      const cartTotal = cartData.total_price;
      const progress = cartTotal / thresholdTotal;
      const progressBar = bar.querySelector('.progress__bar');
      const freeShippingText = bar.querySelector('[data-free-shipping-bar]');
      progressBar.style.setProperty('--progress', progress);
      if (cartTotal < thresholdTotal) {
        const remainingAmount = formatMoney(thresholdTotal - cartTotal, selectors.format);
        freeShippingText.innerHTML = `Spend ${remainingAmount} more to qualify for free shipping.`;
      } else {
        freeShippingText.textContent = window.themeContent.strings.freeShippingSuccess;
      }
    })
  }
}
initCartForm();

// function for product collapsibles 
function initProductCollapsibles() {
  let collapsibleWrapper = document.querySelectorAll('.product__tabs');
  collapsibleWrapper.forEach(tab => {
    if (!tab) {
      return;
    }
    let collapsibleHeader = tab.querySelector('.product-tab__header');
    if (!collapsibleHeader) {
      return;
    }
    collapsibleHeader.addEventListener('click', (event) => {
      event.target.parentElement.querySelector('.product-tab__content').classList.toggle('hidden');
      event.target.querySelector('.icon__arrow').classList.toggle('icon__rotate');
    })
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
          // thumbsSwiperOptions.spaceBetween = 10;
          thumbsSwiperOptions.mousewheel = true;
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
  quantityWrapper.forEach(wrapper => {
    if (!wrapper) {
      return;
    }
    const quantityButton = wrapper.querySelectorAll('button');
    quantityButton.forEach(button => {
      if (!button) {
        return;
      }
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
  })
  
}
initProductQuantitySelector(); 

// Product Variants js
function initProductVariants() {
  let selectors = {
    masterVariantSelector: document.querySelector('.selected-variant__id'),
    productSalePrice: document.querySelector('[data-sale-price]'),
    productRegularPrice: document.querySelector('[data-regular-price]'),
    productUnitPrice: document.querySelector('[data-unit-price]'),
    productSku: document.querySelector('[data-sku]'),
    productInStock: document.querySelector('[data-inventory]'),
    productAddToCartBtn: document.querySelector('[name="add"]'),
    variantSelectors: document.querySelectorAll('[data-selected-variant]'),
    productOptionLabel: document.querySelectorAll('[data-option-name]'),
    productOptions: document.querySelectorAll('.product-form__input'),
    productForm: document.querySelectorAll('.product__form'),
    format: null,
    product: window.themeContent.routes.product,
    formValidationErrorMessage: document.querySelector('.product-form__errors')
  };
  selectors.productForm.forEach(form => {
    if (!form) {
      return;
    }
    if (form) {
      selectors.format = form.dataset.format || 'default';
      selectors.variantSelectors.forEach(selector => {
        selector.addEventListener('change', () => {
          updateProductOptions();
        });
      });
    }
  });

  function updateProductOptions() {
    let selectedOptions = [];
    selectors.variantSelectors.forEach(selector => {
      if (selector.type === 'radio' || selector.type === 'checkbox') {
        selector.closest('.product__swatches-options').classList.remove('selected');
        if (selector.checked) {
          selectedOptions.push(selector.value);
          selector.closest('.product__swatches-options').classList.add('selected');
        }
      } else {
        selectedOptions.push(selector.value);
      }
    });
    // Find the matched variant
    let matchedVariant = selectors.product.variants.find(variant => {
      return selectedOptions.every(option => variant.options.includes(option));
    });

    if (matchedVariant) {
      updateMasterVariant(matchedVariant);
      updateUrl(matchedVariant);
      updateProductPrice(matchedVariant);
      updateProductUnitPrice(matchedVariant);
      updateProductSku(matchedVariant);
      updateAvailability(matchedVariant);
      updateInventory(matchedVariant);
      updateButtons(matchedVariant);
      updateProductInfo(matchedVariant);
      updateMedia(matchedVariant);
      updateOptionsNames(matchedVariant);
    }
  }

  function updateMasterVariant(matchedVariant) {
    if (!selectors.masterVariantSelector) {
      return;
    }
    // selectors.masterVariantSelector.forEach(masterSelect => {
    //   if (!masterSelect) {
    //     return;
    //   }
    //   masterSelect.value = matchedVariant.id;
    // })
    selectors.masterVariantSelector.value = matchedVariant.id;
  }

  function updateUrl(matchedVariant) {
    if (!history.replaceState || !matchedVariant) {
      return;
    }

    var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + matchedVariant.id;
    window.history.replaceState({path: newurl}, '', newurl);
  }

  function updateProductPrice(matchedVariant) {
    if (!selectors.productSalePrice || !selectors.productRegularPrice) {
      return;
    }
    selectors.productSalePrice.textContent = formatMoney(matchedVariant.price,selectors.format);
    selectors.productRegularPrice.textContent = formatMoney(matchedVariant.compare_at_price, selectors.format);

    matchedVariant.compare_at_price > matchedVariant.price ?
      selectors.productRegularPrice.classList.remove('hidden') :
      selectors.productRegularPrice.classList.add('hidden');
  }

  function updateProductUnitPrice(matchedvariant) {
    if (!selectors.productUnitPrice) {
      return;
    }
    if (matchedvariant.unit_price) {
      selectors.productUnitPrice.classList.remove('hidden');
      selectors.productUnitPrice.textContent = `${matchedvariant.unit_price}/${matchedvariant.unit_price_measurement.reference_value} ${matchedvariant.unit_price_measurement.reference_unit}`;
    } else {
      selectors.productUnitPrice.classList.add('hidden');
    }
  }

  function updateProductSku(matchedVariant) {
    if (!selectors.productSku) {
      return;
    }
    selectors.productSku.textContent = matchedVariant.sku;
  }

  function updateButtons(matchedVariant) {
    if (!selectors.productAddToCartBtn) {
      return;
    }
    if (matchedVariant.available) {
      selectors.productAddToCartBtn.textContent = window.themeContent.strings.addToCart;
      selectors.productAddToCartBtn.disabled = false;
    } else {
      selectors.productAddToCartBtn.textContent = window.themeContent.strings.soldOut;
      selectors.productAddToCartBtn.disabled = true;
    }
  }

  function updateAvailability(matchedVariant) {
    let saleBadge = document.querySelector('.sale__badge');
    let soldOutBadge = document.querySelector('.soldout__badge');
    if (!saleBadge || !soldOutBadge) {
      return;
    }
    if (matchedVariant.available) {
      saleBadge.classList.remove('hidden');
      soldOutBadge.classList.add('hidden');
    } else {
      saleBadge.classList.add('hidden');
      soldOutBadge.classList.remove('hidden');
    }
  }

  function updateInventory(matchedVariant) {
    const requestedVariantId = matchedVariant.id;
    fetch(
      `${window.location.protocol}//${window.location.host}${window.location.pathname}?variant=${matchedVariant.id}`)
      .then((response) => response.text())
      .then((responseText) => {
        if (matchedVariant.id !== requestedVariantId) return;
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const inventorySource = html.querySelector('[data-inventory]');
        const inventoryDestination = document.querySelector('[data-inventory]');
        const inventorySource2 = html.querySelector('[data-inventory-count]').dataset.inventoryCount;
        const inventoryDestination2 = document.querySelector('[data-inventory-count]');
        if (!inventorySource || !inventoryDestination) {
          return;
        }
        if (inventorySource && inventoryDestination) inventoryDestination.innerHTML = inventorySource.innerHTML;
        if (!inventorySource2 || !inventoryDestination2) {
          return;
        }
        if (inventorySource2 && inventoryDestination2) inventoryDestination2.setAttribute('data-inventory-count', inventorySource2);
      });
  }

  function updateMedia(matchedVariant) {
    if (!matchedVariant) return;
    if (!matchedVariant.featured_media) return;

    const mediaGalleries = document.querySelectorAll('.product__image img');
    mediaGalleries.forEach(mediaGallery => {
      mediaGallery.setAttribute('src',`${matchedVariant.featured_media.id}`);
    });

    // const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
    // if (!modalContent) return;
    // const newMediaModal = modalContent.querySelector(`[data-media-id="${this.currentVariant.featured_media.id}"]`);
    // modalContent.prepend(newMediaModal);
    //  try {
    //   var currentVariantImage = matchedVariant.featured_media || {};
    //   var imageElement = document.querySelector('.product__image.swiper-slide-active img');
  
    //   if (imageElement && currentVariantImage.preview_image && currentVariantImage.preview_image.src) {
    //     imageElement.setAttribute('src', currentVariantImage.preview_image.src);
    //     console.log('Image source updated:', currentVariantImage.preview_image.src);
    //   } else {
    //     console.warn('Image source not found or invalid:', currentVariantImage);
    //   }
    // } catch (error) {
    //   console.error('Error updating media:', error);
    // }
  }

  function updateProductInfo(matchedVariant) {
    const requestedVariantId = matchedVariant.id;
    fetch(
      `${window.location.protocol}//${window.location.host}${window.location.pathname}?variant=${matchedVariant.id}`)
      .then((response) => response.text())
      .then((responseText) => {
        if (matchedVariant.id !== requestedVariantId) return;
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const inventoryCount = html.querySelector('[data-inventory-count]').dataset.inventoryCount;
        const inventoryCountDestination = document.querySelector('[data-inventory-count]');
        const inventoryMessage = html.querySelector('.product-form__errors');
        const inventoryMessageDestination = document.querySelector('.product-form__errors');
        if (!inventoryCount || !inventoryCountDestination) {
          return;
        }
        if (inventoryCount && inventoryCountDestination) inventoryCountDestination.setAttribute('data-inventory-count', inventoryCount);
        if (!inventoryMessage || !inventoryMessageDestination) {
          return;
        }
        if (inventoryMessage && inventoryMessageDestination) inventoryMessageDestination.innerHTML = inventoryMessage.innerHTML;
      });
    if (! selectors.formValidationErrorMessage) {
      return;
    }
    selectors.formValidationErrorMessage.classList.add('hidden');
  }

  function updateOptionsNames(matchedVariant) {
    
  }
}
initProductVariants();


// Product Form Add To Cart Ajax
function initProductForm() {
  let selectors = {
    productForm: document.querySelectorAll('form[action="/cart/add"]'),
    cartDrawer: document.querySelector('[data-cart-modal]'),
    cartHeaderButton: document.querySelector('.icon__cart'),
    closeDrawerBtn: document.querySelector('.cart-icon__close'),
    cartBox: document.querySelector('[data-cart-modal] .cart-drawer__box'),
    bodyContainer: document.querySelector('body'),
    cartItemCounter: document.querySelectorAll('[data-cart-count]'),
    cartType: 'page',
    cartPopupContent: document.querySelector('.cart-popup__content'),
    cartDrawerContent: document.querySelector("[data-cart]"),
    formValidationErrorMessage: document.querySelector('.product-form__errors')
  };
  
  // Fetch The Cart Type Rather Page, Drawer or Popup
  if (!selectors.cartHeaderButton) {
    return;
  }
  if (selectors.cartHeaderButton) {
    selectors.cartType = selectors.cartHeaderButton.dataset.cartType;
  }
  selectors.cartHeaderButton.addEventListener('click', (event) => {
    if (selectors.cartType === 'drawer') {
      event.preventDefault();
      openCartDrawer();
    }
  })

  // Event for Main Cart Container Click
  if (!selectors.cartDrawer) {
    return;
  }
  selectors.cartDrawer.addEventListener('click', () => {
    closeCartDrawer();
  })

  // Prevent The Cart Box To Click On the Background
  if (!selectors.cartBox) {
    return;
  }
  selectors.cartBox.addEventListener('click', (event) => {
    event.stopPropagation();
  })

  // Event for Close Cart Drawer
  selectors.closeDrawerBtn.addEventListener('click', () => {
    closeCartDrawer();
  })

  // Event For product Form Submit Using Ajax If Cart Type set to Drawer or Popup
  selectors.productForm.forEach(form => {
    if (!form) {
      return;
    }
    form.addEventListener('submit', async (event) => {
      
      if (selectors.cartType === 'drawer' || selectors.cartType === 'popup') {
        event.preventDefault();
        // Submit Form Ajax
        await submitProductForm(form);
      }
    });
  });

  async function submitProductForm(form) {
    await fetch('/cart/add', {
      method: "POST",
      body: new FormData(form),
    });

    // update Cart Drawer
    await updateCartDrawer();

    const stockCounter = form.querySelector('[name="add"]').dataset.inventoryCount;
    const res = await fetch("/cart.js");
    const cartData = await res.json();
    
    // open Cart Drawer
    openCartDrawer();
    
    // Update The Counter
    cartItemCount(cartData);
  }
  async function updateCartDrawer() {
    if (selectors.cartType === 'drawer') {
      const res = await fetch("/?view=ajax-cart");
      const text = await res.text();
      const html = document.createElement("div");
      html.innerHTML = text;
      const newBox = html.querySelector("[data-cart]").innerHTML;
      if (!selectors.cartDrawerContent) {
        return;
      }
      selectors.cartDrawerContent.innerHTML = newBox;
    } else if (selectors.cartType === 'popup') {
      if (!selectors.cartPopupContent) {
        return;
      }
      selectors.cartPopupContent.textContent = window.themeContent.strings.itemAddedSuccess;
    }
    
  
    initCartForm();
  }
  function openCartDrawer() {
    if (selectors.cartDrawer.classList.contains('cart-drawer__left')) {
        selectors.cartDrawer.classList.add('drawer-open__left');
      } else if(selectors.cartDrawer.classList.contains('cart-drawer__right')) {
        selectors.cartDrawer.classList.add('drawer-open__right');
      } else if (selectors.cartDrawer.classList.contains('cart-popup')) {
        selectors.cartDrawer.classList.add('open-cart__popup');
      }
      selectors.bodyContainer.classList.add('drawer__opening');
  }
  function closeCartDrawer() {
    if (selectors.cartDrawer.classList.contains('cart-drawer__left')) {
        selectors.cartDrawer.classList.remove('drawer-open__left');
      } else if(selectors.cartDrawer.classList.contains('cart-drawer__right')) {
        selectors.cartDrawer.classList.remove('drawer-open__right');
      } else if (selectors.cartDrawer.classList.contains('cart-popup')) {
        selectors.cartDrawer.classList.remove('open-cart__popup');
      }
      selectors.bodyContainer.classList.remove('drawer__opening');
  }
  function cartItemCount(cartData) {
    selectors.cartItemCounter.forEach(counter => {
      if (!counter) {
        return;
      }
      if (cartData.item_count > 0) {
        counter.textContent = cartData.item_count;
        counter.classList.remove('hidden');
      } else {
        counter.remove();
      }
      
    })
  }
}
initProductForm();

// Product Quick View 
function initQuickShopCollection() {
  let selectors = {
    quickShopBtn: document.querySelectorAll('.quick-shop__btn'),
    quickShopModal: document.querySelector('.quick-shop__modal'),
    modalCloseBtn: document.querySelector('.quickview-modal__close'),
    quickShopModalBox: document.querySelector('.quick-shop__box'),
    quickViewContainer: document.querySelector('.quick-view__container')
  }
  
  selectors.quickShopBtn.forEach(button => {
    if (!button) return;
    button.addEventListener('click', () => {
      openQuickShopModal();
    });
  });
  
  if(!selectors.modalCloseBtn) return;
  selectors.modalCloseBtn.addEventListener('click', () => {
    closeQuickShopModal();
  });

  if(!selectors.quickShopModal) return;
  selectors.quickShopModal.addEventListener('click', () => {
    closeQuickShopModal();
  });

  if(!selectors.quickShopModalBox) return;
  selectors.quickShopModalBox.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  function openQuickShopModal() {
    selectors.quickShopModal.classList.remove('hidden');
  }
  function closeQuickShopModal() {
    selectors.quickShopModal.classList.add('hidden');
  }
  
  const products = document.querySelectorAll('.collection-grid__item');

  if (!products.length || !window.themeContent.settings.quickView) {
    return;
  }

  products.forEach(product => {
    product.addEventListener('mouseover', productMouseover);
  });

  function productMouseover(evt) {
    let el = evt.currentTarget;
    let productId = el.dataset.productId;
    let handle = el.dataset.productHandle;
    let btn = el.querySelector('.quick-shop__btn');
    preloadProductModal(handle, productId, btn);
  }
  function preloadProductModal(handle, productId) {
    let url = `${window.themeContent.routes.home}products/${handle}?view=quick-view`;
    fetch(url)
    .then(function(responce) {
      return responce.text();
    })
    .then(function(data) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(data, 'text/html');
      const html = document.createElement('div');
      html.innerHTML = data;
      let newData = doc.querySelector('.product-grid[data-product-handle="'+handle+'"]');

      let productMedia = newData.querySelector('.product__image-container');
      let productDescription = newData.querySelector('.product__content-container');
      let productVendor = productDescription.querySelector('.product__vendor');
      let productTitle = productDescription.querySelector('.product__title');
      let productPrice = productDescription.querySelector('.product__price');
      let productVariants = productDescription.querySelector('.product__variants');
      let productSalesTimer = productDescription.querySelector('.product__sales-timer');
      let productQuantitySelector = productDescription.querySelector('.product__quantity');
      let productButtons = productDescription.querySelector('.product__buy-buttons');
      if (productDescription) {
        productDescription.innerHTML = '';
        productDescription.appendChild(productVendor);
        productDescription.appendChild(productTitle);
        productDescription.appendChild(productPrice);
        productDescription.appendChild(productVariants);
        productDescription.appendChild(productSalesTimer);
        productDescription.appendChild(productQuantitySelector);
        productDescription.appendChild(productButtons);
      }

      if (newData) {
        newData.appendChild(productMedia);
        newData.appendChild(productDescription);
      }
      

      if (!selectors.quickViewContainer) return;
      selectors.quickViewContainer.innerHTML = '';
      selectors.quickViewContainer.appendChild(newData);
      document.querySelector('.quick-view__container .product-full__info--btn').classList.remove('hidden');
      initProductmediaSlideShow();
      initProductVariants();
      initProductForm();
    })
    .catch(function(error) {
      console.log('Error', error);
    });
  }


  // function preloadProductModal(handle, productId, btn) {
  //   var holder = document.getElementById('QuickShopHolder-' + handle);
  //   var url = window.themeContent.routes.home + '/products/' + handle + '?view=quick-view';
  //   url = url.replace('//', '/');
  //   fetch(url).then(function(response) {
  //     return response.text();
  //   }).then(function(html) {
  //     var parser = new DOMParser();
  //     var doc = parser.parseFromString(html, 'text/html');
  //     var div = doc.querySelector('.product-grid[data-product-handle="'+handle+'"]');
  //     if (!holder) {
  //       return;
  //     }
  //     holder.innerHTML = '';
  //     holder.append(div);
  //     var modalId = 'QuickShopModal-' + productId;
  //     var name = 'quick-modal-' + productId;
  //   });
  // }
}
initQuickShopCollection();

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
          initQuickShopCollection();
        }
      }
      replaceContent();
    })
  }
}
initProductRecommendations();
})();
