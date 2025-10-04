// Simple global variables
let timerInterval = null;
let timerSeconds = 300;
let isTimerRunning = false;

let breathingInterval = null;
let breathingTimeout = null;
let isBreathing = false;
let breathingPhase = "ready";
let breathingCycle = 0;

let audioContext = null;
let currentSounds = new Map();
let soundSources = [];
let currentFrequency = null;
let frequencyOscillators = [];

const quotes = [
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "Meditation brings wisdom; lack of meditation leaves ignorance.",
    author: "Buddha",
  },
  {
    text: "Wherever you are, be there totally.",
    author: "Eckhart Tolle",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
  },
  {
    text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "The greatest weapon against stress is our ability to choose one thought over another.",
    author: "William James",
  },
  { text: "Silence is sometimes the best answer.", author: "Dalai Lama" },
  {
    text: "Meditation is not evasion; it is a serene encounter with reality.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Life is available only in the present moment.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Do every act of your life as though it were the very last act of your life.",
    author: "Marcus Aurelius",
  },
  {
    text: "If you want to conquer the anxiety of life, live in the moment, live in the breath.",
    author: "Amit Ray",
  },
  {
    text: "Be happy in the moment, that’s enough. Each moment is all we need, not more.",
    author: "Mother Teresa",
  },
  {
    text: "When you realize nothing is lacking, the whole world belongs to you.",
    author: "Lao Tzu",
  },
  {
    text: "Your vision will become clear only when you can look into your own heart.",
    author: "Carl Jung",
  },
  {
    text: "Breath is the bridge which connects life to consciousness.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Calm mind brings inner strength and self-confidence.",
    author: "Dalai Lama",
  },
  {
    text: "Meditation is the discovery that the point of life is always arrived at in the immediate moment.",
    author: "Alan Watts",
  },
  {
    text: "The way out is through the door. Why is it that no one will use this method?",
    author: "Confucius",
  },
  {
    text: "When you sit, you sit. When you walk, you walk. Do not wobble.",
    author: "Seung Sahn",
  },
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha",
  },
  {
    text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
  },
  { text: "Smile, breathe, and go slowly.", author: "Thich Nhat Hanh" },
  {
    text: "You should sit in meditation for twenty minutes every day — unless you are too busy; then you should sit for an hour.",
    author: "Zen Proverb",
  },
  {
    text: "Meditation applies the brakes to the mind.",
    author: "Ramana Maharshi",
  },
  {
    text: "True happiness is… to enjoy the present, without anxious dependence upon the future.",
    author: "Seneca",
  },
  {
    text: "Only in the stillness of the mind can truth be heard.",
    author: "Jiddu Krishnamurti",
  },
  {
    text: "What we are today comes from our thoughts of yesterday.",
    author: "Buddha",
  },
  {
    text: "The thing about meditation is: you become more and more you.",
    author: "David Lynch",
  },
  {
    text: "Meditation is the tongue of the soul and the language of our spirit.",
    author: "Jeremy Taylor",
  },
  {
    text: "Flow with whatever may happen, and let your mind be free.",
    author: "Zhuangzi",
  },
  { text: "Inhale the future, exhale the past.", author: "Unknown" },
  {
    text: "In the midst of movement and chaos, keep stillness inside of you.",
    author: "Deepak Chopra",
  },
  {
    text: "Suffering is due to our disconnection with the inner soul. Meditation is establishing that connection.",
    author: "Amit Ray",
  },
  {
    text: "By meditating on the breath one can free the mind from all distractions.",
    author: "Patanjali",
  },
  {
    text: "When you change the way you look at things, the things you look at change.",
    author: "Wayne Dyer",
  },
  {
    text: "The practice of meditation is the practice of emptiness.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "You cannot control the results, only your actions.",
    author: "Allan Lokos",
  },
  {
    text: "The best way to capture moments is to pay attention. This is how we cultivate mindfulness.",
    author: "Jon Kabat-Zinn",
  },
];

console.log("Script loaded successfully!");

// Initialize audio context
function initAudio() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log("Audio context created");
    } catch (e) {
      console.error("Web Audio not supported", e);
      return false;
    }
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return true;
}

// Timer Functions
function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  document.getElementById("timerDisplay").textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function setTimer(minutes) {
  console.log("Setting timer to", minutes, "minutes");
  if (!isTimerRunning) {
    timerSeconds = minutes * 60;
    updateTimerDisplay();

    // Update active button
    document
      .querySelectorAll(".preset-btn")
      .forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
  }
}

function toggleTimer() {
  console.log("Toggle timer clicked");
  if (isTimerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  console.log("Starting timer");
  isTimerRunning = true;
  document.getElementById("playBtn").textContent = "⏸ Pause";

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      completeTimer();
    }
  }, 1000);
}

function pauseTimer() {
  console.log("Pausing timer");
  isTimerRunning = false;
  document.getElementById("playBtn").textContent = "▶ Start";
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  console.log("Resetting timer");
  pauseTimer();
  timerSeconds = 300;
  updateTimerDisplay();

  // Reset to 5 min button
  document
    .querySelectorAll(".preset-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector(".preset-btn").classList.add("active");
}

function completeTimer() {
  console.log("Timer completed!");
  pauseTimer();
  playCompletionSound();
  document.getElementById("breathingInstruction").textContent =
    "🎉 Meditation session complete! Well done.";
  setTimeout(() => {
    document.getElementById("breathingInstruction").textContent =
      "Click start to begin the 4-7-8 breathing technique";
  }, 5000);
  rotateQuotes();
}

function playCompletionSound() {
  console.log("Playing completion sound");
  if (!initAudio()) return;

  const now = audioContext.currentTime;

  // Create beautiful chime sequence
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.type = "sine";
  osc1.frequency.value = 523.25; // C5
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.3, now + 0.1);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.start(now);
  osc1.stop(now + 1.5);

  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.type = "sine";
  osc2.frequency.value = 659.25; // E5
  gain2.gain.setValueAtTime(0, now + 0.5);
  gain2.gain.linearRampToValueAtTime(0.3, now + 0.6);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 2);
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.start(now + 0.5);
  osc2.stop(now + 2);

  const osc3 = audioContext.createOscillator();
  const gain3 = audioContext.createGain();
  osc3.type = "sine";
  osc3.frequency.value = 783.99; // G5
  gain3.gain.setValueAtTime(0, now + 1);
  gain3.gain.linearRampToValueAtTime(0.4, now + 1.1);
  gain3.gain.exponentialRampToValueAtTime(0.01, now + 3);
  osc3.connect(gain3);
  gain3.connect(audioContext.destination);
  osc3.start(now + 1);
  osc3.stop(now + 3);
}

// Breathing Functions
function toggleBreathing() {
  console.log("Toggle breathing clicked");
  if (isBreathing) {
    stopBreathing();
  } else {
    startBreathing();
  }
}

function startBreathing() {
  console.log("Starting breathing");
  isBreathing = true;
  breathingPhase = "prepare";
  breathingCycle = 0;
  document.getElementById("breathingBtn").textContent = "⏸ Stop";
  document.getElementById("breathingInstruction").textContent =
    "Get ready to begin...";

  breathingTimeout = setTimeout(() => {
    if (isBreathing) {
      breathingPhase = "inhale";
      breathing478Cycle();
    }
  }, 2000);
}

function stopBreathing() {
  console.log("Stopping breathing");
  isBreathing = false;
  document.getElementById("breathingBtn").textContent = "▶ Start Breathing";
  document.getElementById("breathingText").textContent = "Ready";
  document.getElementById("breathingInstruction").textContent =
    "Click start to begin the 4-7-8 breathing technique";
  document.getElementById("breathingCounter").textContent = "";
  document.getElementById("breathingCircle").className = "breathing-circle";

  if (breathingInterval) {
    clearTimeout(breathingInterval);
    breathingInterval = null;
  }
  if (breathingTimeout) {
    clearTimeout(breathingTimeout);
    breathingTimeout = null;
  }
}

function breathing478Cycle() {
  if (!isBreathing) return;

  console.log("Breathing cycle:", breathingPhase);

  const circle = document.getElementById("breathingCircle");
  const text = document.getElementById("breathingText");
  const instruction = document.getElementById("breathingInstruction");
  const counter = document.getElementById("breathingCounter");

  switch (breathingPhase) {
    case "inhale":
      text.textContent = "Inhale";
      instruction.textContent = "Breathe in through your nose for 4 counts";
      circle.className = "breathing-circle inhale";
      counter.textContent = `Cycle ${breathingCycle + 1}`;
      breathingPhase = "hold";
      breathingInterval = setTimeout(breathing478Cycle, 4000);
      break;

    case "hold":
      text.textContent = "Hold";
      instruction.textContent = "Hold your breath for 7 counts";
      circle.className = "breathing-circle hold";
      breathingPhase = "exhale";
      breathingInterval = setTimeout(breathing478Cycle, 7000);
      break;

    case "exhale":
      text.textContent = "Exhale";
      instruction.textContent = "Breathe out through your mouth for 8 counts";
      circle.className = "breathing-circle exhale";
      breathingCycle++;
      breathingPhase = "inhale";
      breathingInterval = setTimeout(() => {
        if (isBreathing) {
          breathing478Cycle();
        }
      }, 8000);
      break;
  }
}

// Sound Functions
function toggleSound(type, buttonElement) {
  console.log("Toggle sound:", type);

  if (currentSounds.has(type)) {
    stopSound(type);
    buttonElement.classList.remove("active");
  } else {
    playSound(type);
    buttonElement.classList.add("active");
  }
}

function stopSound(type) {
  currentSounds.delete(type);
  soundSources.forEach((source) => {
    try {
      if (source && source.stop) source.stop();
      if (source && source.disconnect) source.disconnect();
      if (source && source.pause) source.pause();
    } catch (e) {
      console.log("Error stopping source:", e);
    }
  });
  soundSources = [];
}

function playSound(type) {
  console.log("Playing sound:", type);

  if (!initAudio()) {
    alert("Audio not supported in this browser");
    return;
  }

  try {
    switch (type) {
      case "rain":
        createRainSound();
        break;
      case "ocean":
        createOceanSound();
        break;
      case "forest":
        createForestSound();
        break;
      case "fire":
        createFireSound();
        break;
      case "birds":
        createBirdsSound();
        break;
      case "bowl":
        createBowlSound();
        break;
    }
    currentSounds.set(type, true);
  } catch (e) {
    console.error("Error playing sound:", e);
  }
}

// Sound Creation Functions
function createRainSound() {
  // Load and play the Rain.mp3 file
  const audio = new Audio("assets/sounds/Rain.mp3");
  audio.loop = true;

  // Set volume after audio is loaded
  audio.addEventListener("loadeddata", () => {
    audio.volume = document.getElementById("soundVolume").value / 100;
  });

  // Set initial volume
  audio.volume = document.getElementById("soundVolume").value / 100;

  // Store the audio element for later control
  soundSources.push(audio);

  // Play the audio
  audio.play().catch((e) => {
    console.error("Error playing Rain.mp3:", e);
  });
}

function createOceanSound() {
  // Load and play the Ocean.mp3 file
  const audio = new Audio("assets/sounds/Ocean.mp3");
  audio.loop = true;

  // Set volume after audio is loaded
  audio.addEventListener("loadeddata", () => {
    audio.volume = document.getElementById("soundVolume").value / 100;
  });

  // Set initial volume
  audio.volume = document.getElementById("soundVolume").value / 100;

  // Store the audio element for later control
  soundSources.push(audio);

  // Play the audio
  audio.play().catch((e) => {
    console.error("Error playing Ocean.mp3:", e);
  });
}

function createForestSound() {
  // Load and play the Forest.mp3 file
  const audio = new Audio("assets/sounds/Forest.mp3");
  audio.loop = true;

  // Set volume after audio is loaded
  audio.addEventListener("loadeddata", () => {
    audio.volume = document.getElementById("soundVolume").value / 100;
  });

  // Set initial volume
  audio.volume = document.getElementById("soundVolume").value / 100;

  // Store the audio element for later control
  soundSources.push(audio);

  // Play the audio
  audio.play().catch((e) => {
    console.error("Error playing Forest.mp3:", e);
  });
}

function createFireSound() {
  // Load and play the Fire.mp3 file
  const audio = new Audio("assets/sounds/Fire.mp3");
  audio.loop = true;

  // Set volume after audio is loaded
  audio.addEventListener("loadeddata", () => {
    audio.volume = document.getElementById("soundVolume").value / 100;
  });

  // Set initial volume
  audio.volume = document.getElementById("soundVolume").value / 100;

  // Store the audio element for later control
  soundSources.push(audio);

  // Play the audio
  audio.play().catch((e) => {
    console.error("Error playing Fire.mp3:", e);
  });
}

function createBirdsSound() {
  // Load and play the Birds.mp3 file
  const audio = new Audio("assets/sounds/Birds.mp3");
  audio.loop = true;

  // Set volume after audio is loaded
  audio.addEventListener("loadeddata", () => {
    audio.volume = document.getElementById("soundVolume").value / 100;
  });

  // Set initial volume
  audio.volume = document.getElementById("soundVolume").value / 100;

  // Store the audio element for later control
  soundSources.push(audio);

  // Play the audio
  audio.play().catch((e) => {
    console.error("Error playing Birds.mp3:", e);
  });
}

function createBowlSound() {
  // Load and play the Bowl.mp3 file
  const audio = new Audio("assets/sounds/Bowl.mp3");
  audio.loop = true;

  // Set volume after audio is loaded
  audio.addEventListener("loadeddata", () => {
    audio.volume = document.getElementById("soundVolume").value / 100;
  });

  // Set initial volume
  audio.volume = document.getElementById("soundVolume").value / 100;

  // Store the audio element for later control
  soundSources.push(audio);

  // Play the audio
  audio.play().catch((e) => {
    console.error("Error playing Bowl.mp3:", e);
  });
}

function updateSoundVolume() {
  const volume = document.getElementById("soundVolume").value;
  document.getElementById("soundVol").textContent = volume;

  // Update volume for all currently playing sounds
  soundSources.forEach((source) => {
    if (source && source.volume !== undefined) {
      source.volume = volume / 100;
    }
    // Also handle Web Audio API gain nodes
    if (source && source.gain && source.gain.value !== undefined) {
      source.gain.value = volume / 100;
    }
  });
}

// Frequency Functions
function showTab(tab, tabElement) {
  console.log("Show tab:", tab);

  // Update tabs
  document
    .querySelectorAll(".tab-btn")
    .forEach((t) => t.classList.remove("active"));
  tabElement.classList.add("active");

  // Update grids
  document
    .querySelectorAll(".tab-content")
    .forEach((g) => g.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

function playFrequency(hz, buttonElement) {
  console.log("Play frequency:", hz);

  if (!initAudio()) {
    alert("Audio not supported in this browser");
    return;
  }

  if (currentFrequency === hz) {
    stopAllFrequencies();
    return;
  }

  stopAllFrequencies();
  currentFrequency = hz;

  document
    .querySelectorAll(".frequency-btn")
    .forEach((btn) => btn.classList.remove("active"));
  buttonElement.classList.add("active");

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = hz;
    gainNode.gain.value = document.getElementById("freqVolume").value / 1000;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    frequencyOscillators = [oscillator, gainNode];
  } catch (e) {
    console.error("Error playing frequency:", e);
  }
}

function stopAllFrequencies() {
  console.log("Stopping all frequencies");
  currentFrequency = null;

  document
    .querySelectorAll(".frequency-btn")
    .forEach((btn) => btn.classList.remove("active"));

  frequencyOscillators.forEach((osc) => {
    try {
      if (osc && osc.stop) osc.stop();
      if (osc && osc.disconnect) osc.disconnect();
    } catch (e) {
      console.log("Error stopping oscillator:", e);
    }
  });
  frequencyOscillators = [];
}

function updateFreqVolume() {
  const volume = document.getElementById("freqVolume").value;
  document.getElementById("freqVol").textContent = volume;

  // Update volume for all currently playing frequencies
  frequencyOscillators.forEach((osc) => {
    if (osc && osc.gain && osc.gain.value !== undefined) {
      osc.gain.value = volume / 1000; // Frequencies use /1000 for lower volume
    }
  });

  // Also update any gain nodes that might be stored separately
  frequencyOscillators.forEach((node) => {
    if (node && node.gain && node.gain.value !== undefined) {
      node.gain.value = volume / 1000;
    }
  });
}

// Global Stop Function
function stopEverything() {
  console.log("Stopping everything!");

  // Stop timer
  if (isTimerRunning) {
    pauseTimer();
  }

  // Stop breathing
  if (isBreathing) {
    stopBreathing();
  }

  // Stop all sounds
  currentSounds.clear();
  soundSources.forEach((source) => {
    try {
      if (source && source.stop) source.stop();
      if (source && source.disconnect) source.disconnect();
      if (source && source.pause) source.pause();
    } catch (e) {
      console.log("Error stopping source:", e);
    }
  });
  soundSources = [];

  // Stop all frequencies
  stopAllFrequencies();

  // Reset visual states
  document.querySelectorAll(".item-btn, .frequency-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  console.log("Everything stopped!");
}

// Quote Functions
function rotateQuotes() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteText").textContent = `"${randomQuote.text}"`;
  document.getElementById(
    "quoteAuthor"
  ).textContent = `- ${randomQuote.author}`;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded - initializing...");
  updateTimerDisplay();
  rotateQuotes();
  setInterval(rotateQuotes, 15000);
  console.log("App ready!");
});
