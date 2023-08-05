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
const poster = document.querySelector('.video__poster');
// const externalVideoContainer = document.querySelector('.external-video__container');
const externalVideo = document.querySelector('.external-video__container video');
// const nativeVideoContainer = document.querySelector('.native-video__container');
const nativeVideo = document.querySelector('.native-video__container iframe');

videoPlayIcon.forEach(button => {
  button.addEventListener('click', () => {
      // button.closest('.video-section__content').style.display = 'none';
      // poster.style.display = 'none';
      const externalVideoContainer = button.closest('.video-section__main').querySelector('.external-video__container');
      const nativeVideoContainer = button.closest('.video-section__main').querySelector('.native-video__container');
      const externalVideo = button.closest('.video-section__main').querySelector('.external-video__container iframe');
      const nativeVideo = button.closest('.video-section__main').querySelector('.native-video__container video');
      const overlayContainer = button.closest('.video-section__content').style.display = 'none';
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


    


      
