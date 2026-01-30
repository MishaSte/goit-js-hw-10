import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import '../css/styles.css';

let userSelectedDate;
let startBtn = document.querySelector('.timer-btn');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date();
    userSelectedDate = selectedDates[0];
    if (now >= userSelectedDate) {
      startBtn.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    } else {
      startBtn.disabled = false;
    }
  },
};

let fp = flatpickr('#datetime-picker', options);

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

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

const inputEl = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let timer;
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  inputEl.disabled = true;

  timer = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timer);
      inputEl.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(diff);

    daysEl.textContent = String(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
  }, 1000);
});
