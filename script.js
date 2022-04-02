// global constants
var clueHoldTime = 500; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 5, 6];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0


function startGame(){
    //initialize game variables
    // console.log('hello world')
    progress = 0
  ;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
  
}

function stopGame(){
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(Btn){
  document.getElementById("Button"+Btn).classList.add("lit")
}

function clearButton(Btn){
  document.getElementById("Button"+Btn).classList.remove("lit")
}

function playSingleClue(Btn){
  if(gamePlaying){
    lightButton(Btn);
    playTone(Btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,Btn);
  }
}

function playClueSequence(){
  guessCounter = 0
  clueHoldTime -= 50;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    // console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You Won!");
}
//This bit of code breaks the Game
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  // add game logic here
  
  if (btn == pattern[guessCounter])
  {
    guessCounter += 1;
  }
  else
  {
    loseGame();
  }
  
  if (guessCounter - 1 == progress)
  {
    guessCounter = 0;
    progress += 1;
    console.log('entering new sequence!!!!!!!!!!!!!')
    if (progress > pattern.length - 1)
    {
      console.log('this is the pattern length' + pattern.length);
      winGame();
    }
    else
    {
      playClueSequence();
    }
  }
  
  console.log('this is the progress:', progress);
  console.log('this is the guessCounter:', guessCounter);
      
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 340,
  3: 392,
  4: 466,
  5: 300,
  6: 400,
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)