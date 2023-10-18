(function(){
  let mediaSwiper;
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
        mediaSwiper = new Swiper(MediaSliderContainer, mediaSwiperOptions);
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
    masterVariantSelector: document.querySelectorAll('.selected-variant__id'),
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
    selectors.variantSelectors.forEach(item => {
      if (item.type === 'radio' || item.type === 'checkbox') {
        document.querySelector('.product__swatches-options').classList.remove('selected');
        if (item.checked) {
          selectedOptions.push(selector.value);
          item.closest('.product__swatches-options').classList.add('selected');
        }
      } else {
        selectedOptions.push(selector.value);
      }
    });
    // Find the matched variant
    const product = JSON.parse(document.querySelector('[type="application/json"]').textContent);
    // console.log(product);
    let matchedVariant = selectors.product.variants.find(variant => {
      return selectedOptions.every(option => variant.options.includes(option));
    });

    if (matchedVariant) {
      updateMasterVariant(matchedVariant);
      updateMedia(matchedVariant);
      updateOptionsNames(matchedVariant);
      updateUrl(matchedVariant);
      updateProductPrice(matchedVariant);
      updateProductUnitPrice(matchedVariant);
      updateProductSku(matchedVariant);
      updateAvailability(matchedVariant);
      updateInventory(matchedVariant);
      updateButtons(matchedVariant);
      updateProductInfo(matchedVariant);
    }
  }
  
  function updateMasterVariant(matchedVariant) {
    // if (!selectors.masterVariantSelector) {
    //   return;
    // }
    selectors.masterVariantSelector.forEach(masterSelect => {
      if (!masterSelect) {
        return;
      }
      masterSelect.value = matchedVariant.id;
    })
    // selectors.masterVariantSelector.value = matchedVariant.id;
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
    var selectedVariantId = matchedVariant.featured_media.id;
    const slide = document.querySelector(`.product__thumbs [data-media-id="${selectedVariantId}"]`);
    const productGrid = document.querySelector('.product-media__gallery--grid');
    if (slide) {
      const index = slide.dataset.index;
      mediaSwiper.slideTo(index - 1);
    }
    if (productGrid) {
      const gridItems = productGrid.querySelectorAll('.product__image');
      const activeGridItem = productGrid.querySelector(`[data-media-id="${selectedVariantId}"]`);
      gridItems.forEach(item => {
        if (!item) return;
        item.classList.remove('active');
      });
      if (!activeGridItem) return;
      activeGridItem.closest('.product__image').classList.add('active');
      const index = activeGridItem.dataset.index;
      productGrid.insertBefore(activeGridItem.closest('.product__image'), productGrid.firstChild);
    }
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
        if (!inventoryCount || !inventoryCountDestination) return;
        if (inventoryCount && inventoryCountDestination) inventoryCountDestination.setAttribute('data-inventory-count', inventoryCount);
        
        if (!inventoryMessage || !inventoryMessageDestination) return;
        if (inventoryMessage && inventoryMessageDestination) inventoryMessageDestination.innerHTML = inventoryMessage.innerHTML;

      });
      if (! selectors.formValidationErrorMessage) return;
      selectors.formValidationErrorMessage.classList.add('hidden');
  }

  function updateOptionsNames(matchedVariant) {
    let option1 = document.querySelector('[data-selected-option="selectedOption1"]');
    let option2 = document.querySelector('[data-selected-option="selectedOption2"]');
    let option3 = document.querySelector('[data-selected-option="selectedOption3"]');
    if(!option1) return;
    option1.querySelector('[data-option-name]').textContent = matchedVariant.option1;
    if(!option2) return;
    option2.querySelector('[data-option-name]').textContent = matchedVariant.option2;
    if(!option3) return;
    option3.querySelector('[data-option-name]').textContent = matchedVariant.option3;
  }
}
  initProductVariants();
})();