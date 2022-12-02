const MAX_PROBLEM = 2;

const answer_buttons = document.getElementsByClassName("answer_button");
const next_buttons = document.getElementsByClassName("next_buttons");
const parent = document.getElementsByClassName("interactions")[0];
const hud_bottom = document.getElementsByClassName("hud-bottom")[0];
const hud_question = document.getElementsByClassName("patient-talk-box")[0];


var previousProblems = []; // une liste des problemes qui ont été rencontré

var bigdata;
var dataProblem;
var etape_courante;
var etape = 1;
var dialogueEtape = 1;

var correct;

var score = 0;

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", '../jsons/problemes.json', false);
xmlhttp.send();
if(xmlhttp.status==200){
    bigdata = JSON.parse(xmlhttp.responseText);
}

function loadProblem(id) {
    etape = 1;
    dataProblem = bigdata["prob"+id];
    // console.log(dataProblem);
    loadStage(etape);
}

function loadStage(int) {
    const stages = dataProblem["etape"+int];
    // console.log(stages);
    if (stages == undefined) return;
    else if (stages.type == "text"){
        etape_courante = stages.text;
        dialogueEtape = 1;
        // console.log(etape_courante["dialogue" + dialogueEtape]);
        showText(etape_courante["dialogue" + dialogueEtape]);

    }
    else if (stages.type == "choice"){
        etape_courante = stages.choices;
        correct = stages.correct;
        showButtons(etape_courante, stages.correct);
    }
}

function nextDialogue() {
    dialogueEtape++;
    if (etape_courante["dialogue" + dialogueEtape ]  != undefined){
        clear();
        showText(etape_courante["dialogue" + dialogueEtape]);

    }
    else {
        const next = document.getElementsByClassName("next")[0]; 
        console.log(next);
        hud_question.removeChild(next);
        
        etape++;
        loadStage(etape);
    }
}
function showText(data){
    if (data.docteur != undefined) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("question-box");
        newDiv.textContent = data.docteur;
        
        const buttonNext = document.createElement("a");
        buttonNext.classList.add("next");
        buttonNext.textContent= ">";
        buttonNext.addEventListener('click', () => nextDialogue() );

        hud_question.appendChild(newDiv);
        hud_question.appendChild(buttonNext);
    }
    else if (data.patient != undefined) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("question-box");
        newDiv.textContent = data.patient;
        
        const buttonNext = document.createElement("a");
        buttonNext.classList.add("next");
        buttonNext.textContent= ">";
        buttonNext.addEventListener('click', () => nextDialogue() );

        hud_question.appendChild(newDiv);
        hud_question.appendChild(buttonNext);
    }
}

function showButtons(data, correctButton) {
    // data.splice(data.length()-1,1);
    for (obj in data) {
        if (obj == "correct") continue;
        const newDiv = document.createElement("a");
        newDiv.classList.add("answer-box");
        newDiv.id = obj;
        newDiv.textContent = data[obj];
        if (obj == correctButton){
            newDiv.addEventListener('click', ()=> positiveScore() );
        }
        else {
            newDiv.addEventListener('click', ()=> negativeScore() );
        }
        hud_bottom.appendChild(newDiv);
    }

}
function affichReponses(){
    const listnodes = hud_bottom.childNodes;
    console.log(listnodes); 
    listnodes.forEach(e => {
        console.log(e);
        if (e.id == correct){
            e.style.backgroundColor = "green";
        } 
        else {
            e.style.backgroundColor = "red";
        }
    });
    setTimeout(() => {
    nextStage();
    }, 2000);
}

function positiveScore() {
    score++;
    console.log(score);
    
    affichReponses();
}
function negativeScore() {
    score--;
    console.log(score);

    affichReponses();
}

function nextStage(){
    clear();
    etape++;
    if (dataProblem["etape" + etape] == undefined) {
        randomProblem();
    }
    else {
        loadStage(etape);
    }
}

function clear(){
    while (hud_bottom.firstChild) {
        hud_bottom.removeChild(hud_bottom.firstChild);
    }
    while (hud_question.firstChild){
        hud_question.removeChild(hud_question.firstChild);
    }
}

function randomProblem(){
    var number = Math.round(Math.random() * (MAX_PROBLEM-1) ) + 1;
    if (previousProblems.length == MAX_PROBLEM-1) {
        console.log("all problem solved"); //TODO
    }
    while (previousProblems.includes(number)) {
        number = Math.round(Math.random() * (MAX_PROBLEM-1) ) + 1;
    }
    console.log(number);
    clear();
    loadProblem(number);
    previousProblems.push(number);
}