// ==========================================
//  NUMBER GUESS GAME - Simple Logic
// ==========================================

const MAX_ATTEMPTS = 10;
const MIN = 1;
const MAX = 100;

let secretNumber;
let attemptsLeft;
let attemptsUsed;
let guesses;
let gameOver;

// --- DOM References ---
const guessInput    = document.getElementById('guess-input');
const btnGuess      = document.getElementById('btn-guess');
const feedback      = document.getElementById('feedback');
const attemptsLeftEl= document.getElementById('attempts-left');
const attemptsUsedEl= document.getElementById('attempts-used');
const progressFill  = document.getElementById('progress-fill');
const historySection= document.getElementById('history-section');
const historyList   = document.getElementById('history-list');
const btnNewGame    = document.getElementById('btn-new-game');
const resultOverlay = document.getElementById('result-overlay');
const overlayEmoji  = document.getElementById('overlay-emoji');
const overlayTitle  = document.getElementById('overlay-title');
const overlayMsg    = document.getElementById('overlay-msg');

// --- Start / Reset Game ---
function newGame() {
  secretNumber  = Math.floor(Math.random() * MAX) + MIN;
  attemptsLeft  = MAX_ATTEMPTS;
  attemptsUsed  = 0;
  guesses       = [];
  gameOver      = false;

  // Reset UI
  guessInput.value       = '';
  guessInput.disabled    = false;
  btnGuess.disabled      = false;
  btnNewGame.classList.add('hidden');
  feedback.className     = 'feedback hidden';
  feedback.textContent   = '';
  progressFill.style.width = '0%';
  attemptsLeftEl.textContent = MAX_ATTEMPTS;
  attemptsUsedEl.textContent = 0;
  historyList.innerHTML  = '';
  historySection.style.display = 'none';
  resultOverlay.classList.add('hidden');

  guessInput.focus();
}

// --- Submit Guess ---
function submitGuess() {
  if (gameOver) return;

  const val = parseInt(guessInput.value);

  // Validate
  if (isNaN(val) || val < MIN || val > MAX) {
    showFeedback(`⚠️ Please enter a number between ${MIN} and ${MAX}.`, 'too-high');
    shakeInput();
    return;
  }

  // Already guessed?
  if (guesses.includes(val)) {
    showFeedback(`🔁 You already guessed ${val}! Try a different number.`, 'too-high');
    shakeInput();
    return;
  }

  guesses.push(val);
  attemptsLeft--;
  attemptsUsed++;

  // Update progress
  const pct = (attemptsUsed / MAX_ATTEMPTS) * 100;
  progressFill.style.width = pct + '%';
  attemptsLeftEl.textContent  = attemptsLeft;
  attemptsUsedEl.textContent  = attemptsUsed;

  // Show history
  addHistoryChip(val);

  // Check result
  if (val === secretNumber) {
    showFeedback(`🎉 Correct! The number was ${secretNumber}!`, 'winner');
    endGame(true);
  } else if (attemptsLeft === 0) {
    showFeedback(`😢 Out of chances! The number was ${secretNumber}.`, 'loser');
    endGame(false);
  } else if (val < secretNumber) {
    const hint = getHint(val, secretNumber);
    showFeedback(`📈 Too low! ${hint}`, 'too-low');
  } else {
    const hint = getHint(val, secretNumber);
    showFeedback(`📉 Too high! ${hint}`, 'too-high');
  }

  guessInput.value = '';
  guessInput.focus();
}

// --- Proximity Hint Text ---
function getHint(guess, secret) {
  const diff = Math.abs(guess - secret);
  if (diff <= 3)  return '🔥 Burning hot!';
  if (diff <= 10) return '🌡️ Getting warm...';
  if (diff <= 25) return '❄️ A bit cold.';
  return '🧊 Very cold!';
}

// --- Show Feedback Banner ---
function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className   = `feedback ${type}`;
}

// --- Add a Chip to History ---
function addHistoryChip(val) {
  historySection.style.display = 'block';
  const chip = document.createElement('span');
  chip.className = `history-chip ${val < secretNumber ? 'low' : val > secretNumber ? 'high' : ''}`;
  chip.textContent = val;
  historyList.appendChild(chip);
}

// --- End Game (Win or Lose) ---
function endGame(won) {
  gameOver = true;
  guessInput.disabled = true;
  btnGuess.disabled   = true;
  btnNewGame.classList.remove('hidden');

  // Show overlay after short delay
  setTimeout(() => {
    if (won) {
      overlayEmoji.textContent = '🎉';
      overlayTitle.textContent  = 'You Won!';
      overlayMsg.textContent    =
        `Amazing! You found ${secretNumber} in ${attemptsUsed} ${attemptsUsed === 1 ? 'guess' : 'guesses'}!`;
    } else {
      overlayEmoji.textContent = '💀';
      overlayTitle.textContent  = 'Game Over!';
      overlayMsg.textContent    =
        `Better luck next time! The secret number was ${secretNumber}.`;
    }
    resultOverlay.classList.remove('hidden');
  }, 800);
}

// --- Shake Input on Invalid Entry ---
function shakeInput() {
  guessInput.classList.remove('shake');
  void guessInput.offsetWidth; // reflow to restart animation
  guessInput.classList.add('shake');
  guessInput.addEventListener('animationend', () => {
    guessInput.classList.remove('shake');
  }, { once: true });
}

// --- Allow Enter Key to Submit ---
guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') submitGuess();
});

// --- Start on Load ---
newGame();
