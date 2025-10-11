let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 1;

function startClock() {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10);
    document.getElementById("startBtn").disabled = true;
    document.getElementById("startBtn").style.opacity = "0.6";
  }
}

function stopClock() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
    document.getElementById("startBtn").disabled = false;
    document.getElementById("startBtn").style.opacity = "1";
  }
}

function resetClock() {
  stopClock();
  elapsedTime = 0;
  updateDisplay();
  lapCount = 1;
  document.getElementById("lapTimes").innerHTML = "";
}

function recordLap() {
  if (isRunning) {
    const lapTime = document.getElementById("display").textContent;
    const lapItem = document.createElement("div");
    lapItem.className = "lap-item";
    lapItem.innerHTML = `<span>Lap ${lapCount}</span><span>${lapTime}</span>`;
    document.getElementById("lapTimes").prepend(lapItem);
    lapCount++;
  }
}

function updateTime() {
  elapsedTime = Date.now() - startTime;
  updateDisplay();
}

function updateDisplay() {
  const milliseconds = Math.floor((elapsedTime % 1000) / 10);
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

  let displayText = "";

  if (hours > 0) {
    displayText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    displayText = `${pad(minutes)}:${pad(seconds)}`;
  }

  // Add milliseconds only if needed
  if (hours === 0 && minutes === 0) {
    displayText += `.${pad(milliseconds)}`;
  }

  document.getElementById("display").textContent = displayText;
}

function pad(number) {
  return number < 10 ? "0" + number : number;
}

// Initialize display
updateDisplay();
