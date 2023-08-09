(function(){

// Slideshow
function initSlideshowSwipers() {
  // find all the slideshow wrappers on the page
  let slideshowWrapper = document.querySelectorAll('.slideshow');

  slideshowWrapper.forEach(wrapper => {
    let id = wrapper.getAttribute('data-section-id');
    let autoSlides = wrapper.getAttribute('data-auto-slide');
    let slideDuration = wrapper.getAttribute('data-slide-duration');

    let swiperContainer = document.querySelector('#slideshow-' + id);
    if (swiperContainer) {
      let swiper= new Swiper('#slideshow-' + id, {
        slidesPerView: 1,
        navigation: {
          nextEl: ".swiper-button-next.swiper-button-" + id,
          prevEl: ".swiper-button-prev.swiper-button-" + id,
        },
        autoplay : {
          delay: slideDuration,
          disableOnInteraction: false
        },
        pagination: {
        el: ".swiper-pagination-{{ section.id }}.swiper-pagination",
        clickable: true
        }
      });
    }
  })
}

// Call the function to initialize Slideshoe swipers
initSlideshowSwipers();

// Testimonial Slider
function initTestimonialSwipers() {
  // Find all testimonial wrappers on the page
  let testimonialWrappers = document.querySelectorAll('.testimonial__wrapper');

  testimonialWrappers.forEach(wrapper => {
    let id = wrapper.getAttribute('data-section-id');

    // Check if the Swiper container exists in this section
    let swiperContainer = document.querySelector("#testimonials-" + id);
    if (swiperContainer) {
      // Initialize Swiper for this section
      let swiper = new Swiper("#testimonials-" + id, {
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
          el: ".swiper-pagination.swiper-pagination-" + sectionId,
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
    }
  });
}

// Call the function to initialize testimonial swipers
initTestimonialSwipers();

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




    


      
