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

const players = ["Noemie","Gabrielle","Lucas","Péricles","Manon","Ferdinand","Mila","Quentin.B","Margaux.D","Eva"];

let index=0, time=20, running=false;
let currentPlayer="-", responder="guest";
let scoreGuest=0, scorePlayer=0;
let timerInterval=null;

// SONS
const bgMusic = new Audio("ambient.mp3"); bgMusic.loop=true; bgMusic.volume=0.3;
const correct = new Audio("correct.mp3");
const incorrect = new Audio("incorrect.mp3");
const roulette = new Audio("roulette.mp3"); roulette.loop=true; roulette.volume=0.5;

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

document.getElementById("guestBtn").onclick = () => { responder="guest"; responderEl.textContent="Antwortender: Gast"; };
document.getElementById("playerBtn").onclick = () => { responder="player"; responderEl.textContent="Antwortender: Spieler"; };
document.getElementById("spinBtn").onclick = spinWheel;
document.getElementById("correctBtn").onclick = () => handleAnswer(true);
document.getElementById("wrongBtn").onclick = () => handleAnswer(false);
restartBtn.onclick = restartGame;
document.getElementById("startBtn").onclick = startRound;

function startRound(){ time=20; running=true; questionText.textContent=questions[index].text; updateTimer(); bgMusic.play(); startTimer(); }
function startTimer(){ clearInterval(timerInterval); timerInterval=setInterval(()=>{
  if(time>0 && running){ time--; updateTimer(); }
  else if(time===0 && running){ running=false; incorrect.play(); clearInterval(timerInterval); }
},1000);}
function updateTimer(){ timerEl.textContent=`Zeit: ${time}s`; timerFill.style.width=(time/20)*100+"%";
  timerFill.style.background = time>10?"green":time>5?"yellow":"red"; }

function handleAnswer(ans){ const correctAns=questions[index].answer;
  if(ans===correctAns){ correct.play(); responder==="guest"?scoreGuest++:scorePlayer++; } else incorrect.play();
  running=false; updateScores(); }

function updateScores(){ scoreGuestEl.textContent=scoreGuest; scorePlayerEl.textContent=scorePlayer; }

function nextQuestion(){ if(index<questions.length-1){ index++; questionText.textContent=questions[index].text; time=20; updateTimer(); running=false; }
  else showWinner(); }

function spinWheel() {
  if (players.length === 0) return; // no players left

  roulette.play();
  let i = 0;

  // show cycling animation
  const interval = setInterval(() => {
    currentPlayer = players[i % players.length];
    currentPlayerEl.textContent = `Aktueller Spieler : ${currentPlayer}`;
    i++;
  }, 80);

  setTimeout(() => {
    clearInterval(interval);
    roulette.pause();
    roulette.currentTime = 0;

    // pick a random player from remaining players
    const randomIndex = Math.floor(Math.random() * players.length);
    const selected = players[randomIndex];

    // remove the selected player so they can't be chosen again
    players.splice(randomIndex, 1);

    // show the final selected player
    currentPlayer = selected;
    currentPlayerEl.textContent = `Aktueller Spieler : ${currentPlayer}`;

    correct.play();
  }, 2000);
}
function showWinner(){ winnerEl.textContent=scoreGuest>scorePlayer?"Der Gast gewinnt!":scorePlayer>scoreGuest?"Der Spieler gewinnt!":"Unentschieden!"; winnerEl.classList.remove("hidden"); restartBtn.classList.remove("hidden"); }

function restartGame(){ index=0; time=20; running=false; scoreGuest=0; scorePlayer=0; currentPlayer="-"; updateScores();
  questionText.textContent="Klicke Start"; currentPlayerEl.textContent="Aktueller Spieler : -"; winnerEl.classList.add("hidden"); restartBtn.classList.add("hidden"); }
