const startTime = 1;
let time = startTime * 60 ;
const timerEl = document.querySelector('.main__timer');


let timer = setInterval(updateCountDown,1000);
function updateCountDown(){
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  timerEl.innerHTML = `${minutes} : ${seconds}`;
  if ( minutes == 0 && seconds < 1){
    clearInterval(timer);
    // document.querySelector('.timer_text_icon').style.display = 'none';
    // document.querySelector('.timer_completion_msg').style.display = 'block';
    
  } else {
  time--;
  }
}