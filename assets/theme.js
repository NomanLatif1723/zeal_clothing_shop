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

//  Brands slider for mobile devices
const mobileMedia = window.matchMedia("(max-width:768px)");
const mainContainer = document.querySelector('.text__image-container');
const slideWrapper = document.querySelector('.text__image-wrapper');
const slideItem = document.querySelector('.text__image-item');

if(mobileMedia.matches) {
    if(mainContainer){
        mainContainer.classList.add('swiper');
        mainContainer.classList.add('brands__slider');
    }
    if(slideWrapper){
        slideWrapper.classList.add('swiper-wrapper');
    }
    if(slideItem){
        slideItem.classList.add('.swiper-slide');
    }

    var swiper = new Swiper(".brands__slider", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
}
