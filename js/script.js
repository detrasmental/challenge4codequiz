var questions = [questions];
let minute = new TimelineMax()


// required variables 
var viewHighScore = document.querySelector("#viewHighScore");
var timer = document.getElementById("timer");
var startButton = document.getElementById("startButton");
var confirmPlay = document.querySelector(".confirmPlay");
var startpage = document.querySelector(".startpage");
var quizQuestions = document.querySelector(".quizQuestions");
var quizQuestionsTitle = document.querySelector("#quizQuestionsTitle");
var correctAnswer = document.querySelector(".correctAnswer");
var wrongAnswer = document.querySelector(".wrongAnswer");
var btn1 = document.querySelector("#btn1");
var btn2 = document.querySelector("#btn2");
var btn3 = document.querySelector("#btn3");
var btn4 = document.querySelector("#btn4");
var initials = document.querySelector("#initials");
var submit = document.querySelector("#submit");
var yourResults = document.querySelector(".yourResults");
var finalScore = document.querySelector("#finalScore");
var hiScores = document.querySelector(".hiScores");
var clearHighScores = document.querySelector("#clearHighScores");
var restartButton = document.querySelector("#restartButton");
var scoreBoard = document.querySelector("#scores");


let confirmPlayData=[]
let score;
let intervalId;
let scoreList=[];

//Confirms with the user readiness to start the game, then runs ReadySetGo function
function confirmStart(){
    startpage.classList.add("hide");
    startpage.classList.remove("show");
    confirmPlay.classList.remove("hide");
    confirmPlay.classList.add("show");
    document.querySelectorAll(".confirmPlay button")[0].addEventListener("click",go);
    score = 0;
};

// Listeners start here
startpage.classList.remove("hide")
startButton.addEventListener("click", confirmStart)
viewHighScore.addEventListener("click", viewAllScores)


// view the high scores 
function viewAllScores(){
    quizQuestions.classList.add('hide');
    correctAnswer.classList.add('hide');
    wrongAnswer.classList.add('hide');
    yourResults.classList.add('hide');
    startpage.classList.add('hide');
    hiScores.classList.remove('hide');
    displayScores();
    clearHighScores.addEventListener('click', clearScore );
    restartButton.addEventListener('click', startOver);
}

function reset(){
    dataLength=[];
    clearInterval(intervalId);
}

function go(e){
    reset()
    confirmPlay.classList.add("hide")
    loadData(e.path[0].textContent)
    score=0;
    startTimer()
    quizActual()
}

//hides the confirm ready div and opens up the quizQuestions window

function loadData(x){
        confirmPlayData=questions[0]
        for ( let i in questions[0]){
            dataLength.push(Number([i].join()))
        }
}

//This records the results of each game to local storage
function recordScore(x){
    let str;
    if (localStorage.getItem("keepScore") === null){
        if (typeof x === typeof undefined ){
        } else{
            scoreList.push( {name : `${x}`, score : `${score}` })
            str = JSON.stringify(scoreList)
            localStorage.setItem("keepScore", str); 
        }
    } else{
        str = localStorage.getItem("keepScore"); 
        str = JSON.parse(str);
        str.push( {name : `${x}`, score : `${score}` })
        scoreList = str;
        str = JSON.stringify(str);
        localStorage.setItem("keepScore",str)
    }
}

//Clear high score
function clearScore(){
    scoreBoard.innerHTML = "Recent Scores Cleared";
    scoreList=[];
    localStorage.clear()
}

//When a user wants to restart
function startOver(){
    hiScores.classList.add("hide");
    quizQuestions.classList.add("hide");
    correctAnswer.classList.add("hide");
    wrongAnswer.classList.add("hide");
    yourResults.classList.add("hide");
    startpage.classList.remove("hide");
}

//Scores, if any, in local storage
function displayScores(){
    let scoreKeeper="";
    let x;
    if (localStorage.getItem("keepScore") === null){
        scoreBoard.innerHTML = "No scores yet"

    }else{
        scoreList=localStorage.getItem("keepScore");
        scoreList = JSON.parse(scoreList);
        x = scoreList.sort(function(b,a){
            return a.score - b.score
        })
        scoreList=[];
        for (let i in x ){
            scoreList.push(`<p>${x[i].name} - Score: ${x[i].score}%</p>`)
        }
        for (let i in scoreList){
            scoreKeeper = scoreKeeper + scoreList[i]
        }
        scoreBoard.innerHTML = scoreKeeper;
    }
}

function saveScore(){
    if (initials.value !== ""){
        yourResults.classList.add("hide");
        hiScores.classList.remove("hide")
        recordScore(initials.value)
        viewAllScores();
    }
}

function gameEnd(){
    clearInterval(intervalId)
    quizQuestions.classList.add("hide");
    yourResults.classList.remove("hide");

    
    score = Math.floor(((score/confirmPlayData.length)*100));
    finalScore.textContent = score;
    submit.addEventListener("click",saveScore);
}


function evaluate(e){
    if (e.path[0].textContent === answer){
        setTimeout(()=>{
            correctAnswer.classList.remove("hide");
            setTimeout(()=>{
                correctAnswer.classList.add("hide");
            
            },1000)
        },0)
        wrongAnswer.classList.add("hide");
        score++;
        if (dataLength.length ===0 ){
            gameEnd()
        } else {
            quizActual()
        }
    } else {
        setTimeout(()=>{
            wrongAnswer.classList.remove("hide");
            setTimeout(()=>{
                wrongAnswer.classList.add("hide");
            
            },1000)
        },0)

    // take 10 seconds off for wrong answers
        if (seconds === 0){
            setTimeout(()=>{
                seconds = seconds - 10
            },1001)
        }else{
            seconds = seconds - 10
        }
        correctAnswer.classList.add("hide");
        if (dataLength.length ===0 ){
            gameEnd()
        } else {
            quizActual()
        }
    }
}


function quizActual(){
    quizQuestions.classList.remove("hide");
    wrongAnswer.classList.add("hide");
    correctAnswer.classList.add("hide");
    q = dataLength.shift();
    answer = confirmPlayData[q].answer;
    quizQuestionsTitle.textContent = confirmPlayData[q].title;
    btn1.textContent = confirmPlayData[q].choices[0];
    btn2.textContent = confirmPlayData[q].choices[1];
    btn3.textContent = confirmPlayData[q].choices[2];
    btn4.textContent = confirmPlayData[q].choices[3];
    btn1.addEventListener("click",evaluate);
    btn2.addEventListener("click",evaluate);
    btn3.addEventListener("click",evaluate);
    btn4.addEventListener("click",evaluate);
    quizQuestions.classList.remove("hide");
}

function startTimer(){
    seconds = 0;
    let minutes = 1;
    time = minutes+':'+seconds;
    timer.textContent = time
    intervalId = setInterval(()=>{
        if (seconds == 0){
            seconds = 60;
            minutes--;
        }
        seconds --;
        time = minutes+':'+seconds;
        timer.textContent = time
        if (time === '0:0' ){
            clearInterval(intervalId);
            clearInterval(setInterval);
            gameEnd();
        }
    },1000);
}