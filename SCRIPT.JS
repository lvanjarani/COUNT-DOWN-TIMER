const form = document.getElementById("timer-form");
const input = document.getElementById("target-date");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const statusMessage = document.getElementById("status-message");

const timeFields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

let countdownId = null;

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateDisplay(totalMs) {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timeFields.days.textContent = pad(days);
  timeFields.hours.textContent = pad(hours);
  timeFields.minutes.textContent = pad(minutes);
  timeFields.seconds.textContent = pad(seconds);
}

function clearCountdown() {
  if (countdownId) {
    clearInterval(countdownId);
    countdownId = null;
  }
}

function getTargetTime() {
  const selectedValue = input.value;
  if (!selectedValue) {
    return null;
  }

  const targetTime = new Date(selectedValue).getTime();
  if (Number.isNaN(targetTime)) {
    return null;
  }

  return targetTime;
}

function syncStartButton() {
  const targetTime = getTargetTime();
  startBtn.disabled = !targetTime || targetTime <= Date.now();
}

function resetTimer() {
  clearCountdown();
  updateDisplay(0);
  statusMessage.textContent = "Set a date to begin the countdown.";
  form.reset();
  startBtn.disabled = true;
}

function startCountdown() {
  const targetTime = getTargetTime();

  if (!targetTime || targetTime <= Date.now()) {
    statusMessage.textContent = "Pick a future date and time to start the countdown.";
    syncStartButton();
    return;
  }

  clearCountdown();

  function tick() {
    const remainingTime = targetTime - Date.now();

    if (remainingTime <= 0) {
      clearCountdown();
      updateDisplay(0);
      statusMessage.textContent = "Countdown complete!";
      return;
    }

    updateDisplay(remainingTime);
    statusMessage.textContent = `Counting down to ${new Date(targetTime).toLocaleString()}`;
  }

  tick();
  countdownId = setInterval(tick, 1000);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  startCountdown();
});

input.addEventListener("input", () => {
  syncStartButton();

  if (!startBtn.disabled) {
    startCountdown();
  } else if (input.value) {
    statusMessage.textContent = "Pick a future date and time to start the countdown.";
  } else {
    statusMessage.textContent = "Set a date to begin the countdown.";
  }
});

resetBtn.addEventListener("click", resetTimer);

updateDisplay(0);
syncStartButton();
