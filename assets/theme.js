(function() {
  function Testimonials(container) {
    this.container = container;
    this.timeout = null;
    var sectionId = container.getAttribute('data-section-id');
    this.slideshow = container.querySelector('#testimonials-' + sectionId);
    this.namespace = '.main__section-' + sectionId;
    this.swiper = null; // To store the Swiper instance

    if (!this.slideshow) {
      return;
    }
  }
  Testimonials.prototype = Object.assign({}, Testimonials.prototype, {
    init: function() {
      var sectionId = this.container.getAttribute('data-section-id');

      this.swiper = new Swiper('#swiper-' + sectionId, {
        slidesPerView: 1,
        navigation: {
          nextEl: '.swiper-button-next.swiper-button-' + sectionId,
          prevEl: '.swiper-button-prev.swiper-button-' + sectionId,
        },
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination.swiper-pagination-' + sectionId,
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
      });

      // Autoscroll to next slide on load to indicate more blocks
      if (this.slideshow.dataset.count > 2) {
        this.timeout = setTimeout(() => {
          this.swiper.slideNext();
        }, 1000);
      }

      this.bindEvents();
    },

    bindEvents: function() {
      if (this.swiper) {
        this.swiper.on('slideChange', () => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.swiper.slideNext();
          }, 2500);
        });

        this.slideshow.addEventListener('block-select', (evt) => {
          var slide = this.slideshow.querySelector('.testimonials-slide--' + evt.detail.blockId);
          var index = parseInt(slide.dataset.index);

          clearTimeout(this.timeout);

          if (this.swiper) {
            this.swiper.slideTo(index);
            this.swiper.autoplay.stop();
          }
        });

        this.slideshow.addEventListener('block-deselect', () => {
          if (this.swiper && this.swiper.autoplay) {
            this.swiper.autoplay.start();
          }
        });
      }
    },
  });

  return Testimonials;
})();

(function(){

})();
// announcement timer 
const timerEl = document.querySelector('.main__timer');

if(timerEl){
    const hours = timerEl.getAttribute('data-hour');
    const minutes = timerEl.getAttribute('data-minutes');
    function startTimer(hours, minutes) {
        // Convert hours and minutes to milliseconds
        var totalMilliseconds = (hours * 3600000) + (minutes * 60000);
    
        // Ensure the timer is valid
        if (totalMilliseconds <= 0) {
        console.log("Invalid timer duration");
        return;
        }
    
        var timerInterval = setInterval(function() {
        // Calculate remaining hours, minutes, and seconds
        var remainingHours = Math.floor(totalMilliseconds / 3600000);
        var remainingMinutes = Math.floor((totalMilliseconds % 3600000) / 60000);
        var remainingSeconds = Math.floor((totalMilliseconds % 60000) / 1000);
        
        timerEl.innerHTML = `${remainingHours} : ${remainingMinutes} : ${remainingSeconds}`;
    
        // Reduce remaining time by 1 second
        totalMilliseconds -= 1000;
    
        // Check if the timer has ended
        if (totalMilliseconds <= 0) {
            clearInterval(timerInterval);
            timerEl.innerHTML = "00 : 00 : 00";
        }
        }, 1000);
    }
    startTimer(hours, minutes);
}

// featured Collection

document.querySelectorAll('.show-more__swatches').forEach(option => {
  option.addEventListener('click', () => {
    const hiddenSwatches = option.closest('.color-swatch__list').querySelector('.hidden__swatches');
    option.classList.add('hide');
    hiddenSwatches.classList.add('show');
  })
})

// Video Section Events

const videoPlayIcon = document.querySelectorAll('.video-section__playicon');
videoPlayIcon.forEach(button => {
  button.addEventListener('click', () => {
      const externalVideoContainer = button.closest('.video-section__main').querySelector('.external-video__container');
      const nativeVideoContainer = button.closest('.video-section__main').querySelector('.native-video__container');
      const externalVideo = button.closest('.video-section__main').querySelector('.external-video__container iframe');
      const nativeVideo = button.closest('.video-section__main').querySelector('.native-video__container video');
      const overlayContainer = button.closest('.video-section__content');
      const poster = button.closest('.video-section__main').querySelector('.video__poster');
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
  })
})




    


      
