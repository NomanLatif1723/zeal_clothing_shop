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
const poster = document.querySelector('.video-poster__image');
const externalVideoContainer = document.querySelector('.external-video__container');
const nativeVideoContainer = document.querySelector('.native-video__container');

videoPlayIcon.forEach(button => {
  button.addEventListener('click', () => {
    console.log("button clicked");
    button.closest('.video-section__content').style.display = 'none';
    poster.style.display = 'none';
    if(externalVideoContainer) {
      button.closest('.video-section__main').querySelector('.external-video__container').classList.remove('video-container__hide');
      button.closest('.video-section__main').querySelector('.external-video__container video').play();
      
    } else {
      button.closest('.video-section__main').querySelector('.native-video__container').classList.remove('video-container__hide');
    }
    
  })
})

    


      
