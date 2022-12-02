const MAX_PROBLEM = 1;

const answer_buttons = document.getElementsByClassName("answer_button");
const next_buttons = document.getElementsByClassName("next_buttons");
const parent = document.getElementsByClassName("interactions")[0];

var previousProblems = []; // une liste des problemes qui ont été rencontré

var bigdata;
var dataProblem;
var etape_courante;
var etape = 1;
var dialogueEtape = 1;

var score = 0;

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", '../jsons/problemes.json', false);
xmlhttp.send();
if(xmlhttp.status==200){
    bigdata = JSON.parse(xmlhttp.responseText);
}

function loadProblem(id) {
    etape = 1;
    dataProblem = bigdata["prob2"+id];
    loadStage(etape);
}

function loadStage(int) {

    const stages = dataProblem["etape"+int];
    if (stages == undefined) return;
    else if (stages.type == "text"){
        etape_courante = stages;
        dialogueEtape = 1;
        showText(etape_courante["dialogue" + dialogueEtape]);

    }
    else if (stages.type == "choice"){
        showButtons(stages.choices);
    }
}

function nextDialogue() {
    dialogueEtape++;
    if (!etape_courante["dialogue"] + dialogueEtape){
        clear();
        showText(etape_courante["dialogue"] + dialogueEtape);
    }
}
function showText(data){
    if (data.doctor != undefined) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("dialogue_doctor");
        newDiv.textContent = data.doctor;
        
        const buttonNext = document.createElement("a");
        buttonNext.classList.add("next_doctor");
        buttonNext.textContent= ">";
        buttonNext.addEventListener('click', () => nextDialogue() );

        parent.appendChild(newDiv);
        parent.appendChild(buttonNext);
    }
    else if (data.patient != undefined) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("dialogue_patient");
        newDiv.textContent = data.patient;
        
        const buttonNext = document.createElement("a");
        buttonNext.classList.add("next_patient");
        buttonNext.textContent= ">";
        buttonNext.addEventListener('click', () => nextDialogue() );

        parent.appendChild(newDiv);
        parent.appendChild(buttonNext);
    }
}

function showButtons(data) {
    const correctButton = data.correct;
    // data.splice(data.length()-1,1);
    for (obj in data) {
        if (obj == "correct") continue;
        const newDiv = document.createElement("a");
        newDiv.classList.add("answer_box");
        newDiv.textContent = data[obj];
        if (obj == correctButton){
            newDiv.addEventListener('click', ()=> positiveScore() );
        }
        else {
            newDiv.addEventListener('click', ()=> negativeScore() );
        }
        parent.appendChild(newDiv);
    }

}

function positiveScore() {
    score++;
    console.log(score);
    nextStage();
}
function negativeScore() {
    score--;
    console.log(score);
    nextStage();
}

function nextStage(){
    clear();
    etape++;
    if (dataProblem["etape"+int] == undefined) {
        randomProblem();
    }
    else {
        loadStage(etape);
    }
}

function clear(){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function randomProblem(){
    const number = Math.random() * MAX_PROBLEM +1;
    if (previousProblems.length == MAX_PROBLEM) {
        console.log("all problem solved"); //TODO
    }
    while (previousProblems.includes(number)) {
        number = Math.random() * MAX_PROBLEM +1;
    }
    clear();
    loadProblem(number);
}