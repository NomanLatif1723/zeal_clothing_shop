// const startTime = 1;
// let time = startTime * 60 ;
// const timerEl = document.querySelector('.main__timer');


// let timer = setInterval(updateCountDown,1000);
// function updateCountDown(){
//   const minutes = Math.floor(time / 60);
//   let seconds = time % 60;
//   seconds = seconds < 10 ? '0' + seconds : seconds;
//   timerEl.innerHTML = `${minutes} : ${seconds}`;
//   if ( minutes == 0 && seconds < 1){
//     clearInterval(timer);
//     // document.querySelector('.timer_text_icon').style.display = 'none';
//     // document.querySelector('.timer_completion_msg').style.display = 'block';
    
//   } else {
//   time--;
//   }
// }

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
  
      // Output the remaining time
      const timerEl = document.querySelector('.main__timer');
      timerEl.innerHTML = `${remainingHours} : ${remainingMinutes} : ${remainingSeconds}`;
  
      // Reduce remaining time by 1 second
      totalMilliseconds -= 1000;
  
      // Check if the timer has ended
      if (totalMilliseconds <= 0) {
        clearInterval(timerInterval);
        console.log("Timer has ended");
      }
    }, 1000); // Run the timer every 1 second
  }
  
  // Example usage
//   var hours = parseInt(prompt("Enter the number of hours:"));
//   var minutes = parseInt(prompt("Enter the number of minutes:"));
  
  startTimer(2, 30);
  