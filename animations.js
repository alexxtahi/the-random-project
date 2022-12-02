// Create focus animation in answer-box
var previousAnswer = null;
$('.answer-box').on('click', function() {
    console.log('The patient is talking...');
    if (previousAnswer != null)
        previousAnswer.classList.remove("answer-box-active");

    previousAnswer = this
    this.classList.add("answer-box-active");
    // $('.patient').style.animation = "spin2 4s linear infinite";
});

// Animate the patient when he'is talking
// $('.patient').on('click', function() {
//     this.classList.add("patient-talking");
// });