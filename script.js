// https://opentdb.com/api.php?amount=10
//https://opentdb.com/api.php?amount=10&difficulty=hard
//https://opentdb.com/api.php?amount=10&difficulty=medium
//https://opentdb.com/api.php?amount=10&difficulty=easy



const _question = document.getElementById("question");
const _options = document.querySelector(".quiz-options");
const _correctScore = document.getElementById("correct-score");
const _totalQuestion = document.getElementById("total-question");
const _checkBtn = document.getElementById("check-answer");
const _playAgainBtn = document.getElementById("play-again")
const _result = document.getElementById("result");

function nivelDificultad() { 
    let select = document.getElementById('nivel');
    let option = select.options[select.selectedIndex];
    let nivelD = option.value;
    return nivelD;
  }

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

function eventListeners(){
    _checkBtn.addEventListener("click", checkAnswer);
    _playAgainBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuestion();
    eventListeners();

    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

async function loadQuestion(){
    let nivelD = nivelDificultad();

    const APIurl = `https://opentdb.com/api.php?amount=10&difficulty=${nivelD}`;
    console.log(nivelD);
    //console.log(APIurl_2);
    //const APIurl = "https://opentdb.com/api.php?amount=10";
    const result = await fetch( `${APIurl}`);
    const data = await result.json();
    //console.log(data.results[0]);
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

// Display Question and Options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random()*(incorrectAnswer.length + 1)), 0, correctAnswer); // Inserting correct answer in random position in the options list
    console.log(optionsList);
    console.log(correctAnswer);

    _question.innerHTML = `${data.question} <br> <span class = "category">${data.category} </span>`;
    _options.innerHTML = `${optionsList.map((option, index) => `
        <li> ${index + 1}. <span> ${option} </span></li>`).join("")} 
        `;

    selectOption();
}

// Options selection
function selectOption(){
    _options.querySelectorAll("li").forEach((option) => {
        option.addEventListener("click", () => {
            //console.log("hello");
            if(_options.querySelector(".selected")){
                const activeOption = _options.querySelector(".selected");
                activeOption.classList.remove("selected");
            }
            option.classList.add("selected");
        });
    });
    console.log(correctAnswer);
}

// Answer checking

function checkAnswer(){
   console.log("hola"); 
   _checkBtn.disabled = true;
   if(_options.querySelector(".selected")){
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    console.log(selectedAnswer);
    if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
        correctScore++;
        _result.innerHTML = `<p> <i class = "fas fa-check"></i> !Respuesta Correcta! </p>`;
    }else{
        _result.innerHTML = `<p> <i class = "fas fa-check"></i> !Respuesta Incorrecta! </p>
        <p><small><b>La respuesta correcta es: </b> ${correctAnswer}<small></p>`;
    }
    checkCount();
   }else{
    _result.innerHTML = `<p><i class = "fas fa-question"></i>!Por favor seleccione una opción! </p>`;
    _checkBtn.disabled = false;
   }
}

// To convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
    //alert("Hola!!!");
    _result.innerHTML += `<p> puntaje es ${correctScore}.</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
    }else{
        setTimeout(() =>{
            loadQuestion();
        }, 500);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent =  correctScore;
}

function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = "false";
    setCount();
    loadQuestion();
}
loadQuestion();