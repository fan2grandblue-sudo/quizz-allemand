console.log("Start button:", document.getElementById("startBtn"));

const questions = [
  { text: "Die ersten Paralympischen Spiele fanden 1960 statt.", answer: true },
  { text: "Im Jahr 1960 nahmen 23 Länder an den Paralympischen Spielen teil.", answer: true },
  { text: "Die ersten Paralympischen Spiele fanden in Paris statt.", answer: false },
  { text: "Im Jahr 1960 gab es bereits mehr als 1 000 Sportler.", answer: false },
  { text: "Die Paralympischen Winterspiele fanden erstmals 1992 statt.", answer: false },
  { text: "Seit 1988 finden die Paralympischen Spiele in der\n selben Stadt statt wie die Olympischen Spiele.", answer: true },
  { text: "Die Paralympischen Spiele finden vor den Olympischen Spielen statt.", answer: false },
  { text: "Die Paralympischen Spiele in Tokio fanden 2020 statt.", answer: false },
  { text: "Bei den Olympischen Spielen 2021 in Tokio nahmen 4.500\n Sportler aus 160 Ländern in 23 Sportarten teil.", answer: true },
  { text: "Im Jahr 2021 gab es weniger als 20 Sportarten", answer: false }
];

const allPlayers = ["Noemie","Gabrielle","Lucas","Péricles","Manon","Ferdinand","Mila","Quentin.B","Margaux.D","Eva"];
let players = [...allPlayers];

let index = 0, time = 20, running = false;
let currentPlayer = "-", responder = "guest";
let scoreGuest = 0, scorePlayer = 0;
let timerInterval = null;

// AUDIO
const bgMusic = new Audio("ambient.mp3"); bgMusic.loop = true; bgMusic.volume = 0.3;
const correct = new Audio("correct.mp3");
const incorrect = new Audio("incorrect.mp3");
const roulette = new Audio("roulette.mp3"); roulette.loop = true; roulette.volume = 0.5;

// ELEMENTS
const questionText = document.getElementById("questionText");
const timerEl = document.getElementById("timer");
const timerFill = document.getElementById("timerFill");
const scoreGuestEl = document.getElementById("scoreGuest");
const scorePlayerEl = document.getElementById("scorePlayer");
const currentPlayerEl = document.getElementById("currentPlayer");
const responderEl = document.getElementById("responder");
const winnerEl = document.getElementById("winner");
const restartBtn = document.getElementById("restartBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
nextQuestionBtn.onclick = nextRound; // calls the function to start next round

// BUTTONS
document.getElementById("guestBtn").onclick = () => { responder="guest"; responderEl.textContent="Antwortender: Gast"; };
document.getElementById("playerBtn").onclick = () => { responder="player"; responderEl.textContent="Antwortender: Spieler"; };
document.getElementById("spinBtn").onclick = nextRound;
document.getElementById("correctBtn").onclick = () => handleAnswer(true);
document.getElementById("wrongBtn").onclick = () => handleAnswer(false);
restartBtn.onclick = restartGame;
document.getElementById("startBtn").onclick = startRound;


// START GAME
function startRound(){
  index = 0;
  players = [...allPlayers]; // reset players
  scoreGuest = 0;
  scorePlayer = 0;
  currentPlayer = "-";
  running = false;
  updateScores();
  questionText.textContent = "Klicke Spin, um einen Spieler auszuwählen";
  currentPlayerEl.textContent = "Aktueller Spieler : -";
  winnerEl.classList.add("hidden");
  restartBtn.classList.add("hidden");
  bgMusic.play();
}

// TIMER
function startTimer(){
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if(time > 0 && running){
      time--;
      updateTimer();
    } else if(time === 0 && running){
      running = false;
      incorrect.play();
      clearInterval(timerInterval);
      // move to next question automatically
      index++;
      nextRound();
    }
  }, 1000);
}

function updateTimer(){
  timerEl.textContent = `Zeit: ${time}s`;
  timerFill.style.width = (time / 20) * 100 + "%";
  timerFill.style.background = time > 10 ? "green" : time > 5 ? "yellow" : "red";
}

// HANDLE ANSWER
function handleAnswer(ans){
  if(!running) return;

  const correctAns = questions[index].answer;
  if(ans === correctAns){
    correct.play();
    responder === "guest" ? scoreGuest++ : scorePlayer++;
  } else {
    incorrect.play();
  }

  running = false;
  clearInterval(timerInterval);
  updateScores();

  // show "Next Question" button
  nextQuestionBtn.classList.remove("hidden");
}

// UPDATE SCORE DISPLAY
function updateScores(){
  scoreGuestEl.textContent = scoreGuest;
  scorePlayerEl.textContent = scorePlayer;
}

// PICK PLAYER AND SHOW QUESTION
function nextRound() {
  // Hide the "Next Question" button at the start
  nextQuestionBtn.classList.add("hidden");

  // Check if all questions are done
  if (index >= questions.length) {
    showWinner();
    return;
  }

  // Check if there are still players left
  if (players.length === 0) {
    alert("Keine Spieler mehr übrig!");
    showWinner();
    return;
  }

  // Start roulette animation
  roulette.play();
  let i = 0;
  const interval = setInterval(() => {
    currentPlayer = players[i % players.length];
    currentPlayerEl.textContent = `Aktueller Spieler : ${currentPlayer}`;
    i++;
  }, 80);

  // After 2 seconds, pick a random player and show question
  setTimeout(() => {
    clearInterval(interval);
    roulette.pause();
    roulette.currentTime = 0;

    // Pick a random player from remaining players
    const randomIndex = Math.floor(Math.random() * players.length);
    const selected = players[randomIndex];

    // Remove the selected player so they can't be picked again
    players.splice(randomIndex, 1);

    // Show the final selected player
    currentPlayer = selected;
    currentPlayerEl.textContent = `Aktueller Spieler : ${currentPlayer}`;
    correct.play();

    // Show the current question
    questionText.textContent = questions[index].text;

    // Reset and start the timer
    time = 20;
    updateTimer();
    running = true;
    startTimer();
  }, 2000);
}
// SHOW WINNER
function showWinner(){
  winnerEl.textContent = scoreGuest > scorePlayer ? "Der Gast gewinnt!" : scorePlayer > scoreGuest ? "Der Spieler gewinnt!" : "Unentschieden!";
  winnerEl.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
}

// RESTART GAME
function restartGame(){
  index = 0;
  players = [...allPlayers];
  scoreGuest = 0;
  scorePlayer = 0;
  currentPlayer = "-";
  running = false;
  updateScores();
  questionText.textContent = "Klicke Start";
  currentPlayerEl.textContent = "Aktueller Spieler : -";
  winnerEl.classList.add("hidden");
  restartBtn.classList.add("hidden");
}
