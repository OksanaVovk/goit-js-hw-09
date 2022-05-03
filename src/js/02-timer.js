import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('[data-start]');
const textInput = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtn.disabled = true;
textInput.disabled = false;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // console.log(options.defaultDate);
    // console.log(options.defaultDate.getTime());
    // console.log(selectedDates[0].getTime());
    if (selectedDates[0].getTime() < options.defaultDate.getTime()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      startBtn.disabled = false;
    }
  },
};

const calendars = flatpickr('#datetime-picker', options);
// console.dir(flatpickr);
// console.dir(calendars);

startBtn.addEventListener('click', onBtnclick);

function onBtnclick() {
  timerId = setInterval(() => {
    const currentDate = new Date().getTime();
    const choseDate = calendars.selectedDates[0].getTime();

    let deltaTime = choseDate - currentDate;

    if (deltaTime > 0) {
      const timeArray = convertMs(deltaTime);
      daysEl.textContent = addLeadingZero(timeArray.days, 2, '0');
      hoursEl.textContent = addLeadingZero(timeArray.hours, 2, '0');
      minutesEl.textContent = addLeadingZero(timeArray.minutes, 2, '0');
      secondsEl.textContent = addLeadingZero(timeArray.seconds, 2, '0');
    }
    if (deltaTime < 1000) {
      clearInterval(timerId);
    }
  }, 1000);
  startBtn.disabled = true;
  textInput.disabled = true;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value, num, str) {
  return String(value).padStart(num, str);
}
