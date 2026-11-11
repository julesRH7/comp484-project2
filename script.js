/*2 methods used: 
.one():line 191, 194
.prop():line 95, 221, 222, 233, 234
*/
$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.run-button').click(clickedRunButton);
    $('.try-again-button').click(clickedTryAgainButton);
    $('.treat-button, .play-button, .exercise-button, .try-again-button').click(function(){
      $('.run-message').removeClass('visible').text('');
    });
});
  
    // Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
    var pet_info = {name:"Cerberus", weight:2000, happiness:15};
    var pet_angry = false;
    var escaped = false;
    var weightIssue = false;

    function clickedTreatButton(name, happiness, weight) {
      //updates values, performes +/- animations, shows notif. Same for all buttons
      showFloatText(this, 5, 10);
      performAction('treat',5,10);
      if(!pet_angry){
        showPetComment("Woof! *Tail wagging intensifies*");
      }
    }
    
    function clickedPlayButton(name, happiness, weight) {
      showFloatText(this,2,-20);
      performAction('play',2,-20);
      if(!pet_angry){
        showPetComment("Arf! Arf!");
      }
    }
    
    function clickedExerciseButton(name, happiness, weight) {
      showFloatText(this,-5,-50);
      performAction('exercise',-5,-50);
      if(!pet_angry){
        showPetComment("*Grumbling growl*");
      }
    }

    function clickedRunButton(name, happiness, weight) {
      showFloatText(this,-10,0);
      performAction('run',-10,0);
      showPetComment("ROOOOARRR!");
      //don't display run message if an end screen is about to show instead
      if(!pet_angry){
        $('.run-message').text("Why would you run from your pet???");
        requestAnimationFrame(function(){
        $('.run-message').addClass('visible');
        });
      }
    }

    function performAction(actName, happiness, weight){
      //check whether pet is angry to end the game
      if(pet_angry){
        if(actName == 'run'){
          showEnd(true);
        }
        else{
          showEnd(false);
        }
        return;  
      }

      //If not over, change happiness value based on values passed from button clicked
      pet_info.happiness+=happiness;
      //Same for weight
      pet_info.weight+=weight;
      checkAndUpdatePetInfoInHtml();
    }

    function clickedTryAgainButton() {
      //Reset pet_info to original values then update html
      pet_info = {name:"Cerberus", weight:2000, happiness:15};
      pet_angry = false;
      escaped = false;
      weightIssue = false;
      $('.run-button').removeClass('glow');
      //next 2 lines only to handle edge case where text bubble wouldn't disappear on try-again push (nor startup)
      $('.pet-comment').css('transition','none').removeClass('visible');
      $('.pet-comment-text').text('');
      //.prop('hidden, true') takes what would be a false value on the end screen's property 'hidden' when this line executes and changes it to true, hiding the good/bad end screen to revert back to the normal gameplay screen (more detailed explanation of the prop method on line 220)
      $('.end').removeClass('visible good bad weird').prop('hidden', true);
      checkAndUpdatePetInfoInHtml();
    }
    function checkAndUpdatePetInfoInHtml() {
      checkWeightAndHappinessBeforeUpdating();  
      updatePetInfoInHtml();
    }
    
    function checkWeightAndHappinessBeforeUpdating() {
      // Add conditional so if weight is lower than zero, it doesn't end up negative
      if (pet_info.weight <= 0){
        pet_info.weight = 0;
      //if the user hasn't been alerted about the low weight, do so now. else, show the end screen  
      if (!weightIssue) {
        weightIssue = true;
      }
      else {
        showWeightEnd();
      }
    }  
      $('.weight').text(pet_info.weight);
      //next 3 conditionals control messages while turning on/off visible from CSS
      if(pet_info.weight>=100){
        weightIssue = false;
      }
      if (weightIssue) {
        $('.weight-message').text("Feed this thing NOW.").addClass('visible');
      }
      else if (pet_info.weight < 100) {
        $('.weight-message').text("...are you about to starve a 2000 pound dog?").addClass('visible');
      }
      else {
        $('.weight-message').text('').removeClass('visible');
      }
      // same 0 check as weight
      if (pet_info.happiness < 0) {
        pet_info.happiness = 0;
        pet_angry = true;
        //if angry cause run to glow to end game
        $('.run-button').addClass('glow');
      }
    }
    // Updates your HTML with the current values in your pet_info object
    function updatePetInfoInHtml() {
      $('.name').text(pet_info['name']);
      if(pet_angry) {
        $('.happiness').text("He seems really angry! Do Something!");
        $('.happiness-unit').hide();
      }
      else{  
        //preventing overwriting warning message if game is about to end by putting this in an if/else statement
        $('.happiness').text(pet_info['happiness']);
        $('.happiness-unit').show();
      }
    }


    //text floats down from clicked based on positive/negative value
    function showFloatText(button, happiness, weight){
      let happinessPosition = $('.happiness').offset();
      let weightPosition = $('.weight').offset();
      let happyText = happiness;
      let weightText = weight;
        if (happiness>=0){
          happyText = '+' + happiness;
        }
      let floatTextHappy = $('<span>').text(happyText);
        if(weight>=0){
          weightText = '+' + weight;
        }
        let floatTextWeight = $('<span>').text(weightText);
      //determine class (color) to use based on value gained/lost for both happiness and weight (defined in CSS)
      if(!pet_angry){
        if(happiness>0){
          floatTextHappy.addClass('float-text-good');
        }
        else{
          floatTextHappy.addClass('float-text-bad');
        }
        if(weight>0){
          floatTextWeight.addClass('float-text-good');
        }
        else{
          floatTextWeight.addClass('float-text-bad');
        }
        //next 2 snippits used to prevent overlapping numbers
        floatTextHappy.css({
          top: happinessPosition.top,
          left: happinessPosition.left+160
        });
        floatTextWeight.css({
          top:weightPosition.top,
          left:weightPosition.left+100
        });
        //.one() is used here twice, for both happiness and weight. The method .one() takes 2 parameters: the predefined event 'animationend' and an anonymous function. Once the animation defined in the CSS lines 151/159 end, the anonymous function executes and the call "floatTextHappy/Weight.remove()" will remove the floating text elements from the HTML. .one() then automatically removes those event handlers, as they are only meant to be handled once.
        $('body').append(floatTextHappy,floatTextWeight);
        floatTextHappy.one('animationend', function() {
          floatTextHappy.remove();
        });
        floatTextWeight.one('animationend', function() {
          floatTextWeight.remove();
        });
      }  
    }
    //handles comment and speech bubble
    function showPetComment(message){
      $('.pet-comment-text').text(message);
      $('.pet-comment').removeClass('visible');
      requestAnimationFrame(function(){
        $('.pet-comment').addClass('visible');
      });
    }

    function showEnd(escaped) {
      pet_angry = true;
      //show end screen and proper message
      let screen = $('.end');
      if(escaped){
        screen.addClass('good');
        $('.end-message').text("You got away! Maybe try an easier pet next time. Or, just try again?");
      }
      else{
        screen.addClass('bad');
        $('.end-message').text("You're not very good with pets...");
      }
      //.prop() is used twice here, both to control the 'hidden' property. Taking a property name and value as parameters, .prop('hidden',false) changes the screen's (line 200) and try-again-button's (line 201) hidden property from the initially set true value now to false, revealing the two elements. 
      screen.prop('hidden', false);
      $('.try-again-button').prop('hidden', false);
      requestAnimationFrame(function() {
        screen.addClass('visible');
      });
    }
    //separate end screen using different logic; only in drastically different case if pet is starved
    function showWeightEnd(){
      let screen = $('.end');
      screen.addClass('weird');
      $('.end-message').text("You actually did it. You starved him to death. That must've taken a lot of dedication, you monster");
      //prop() here is used with the same function as above with changing the hidden property
      screen.prop('hidden',false);
      $('.try-again-button').prop('hidden', false);
      requestAnimationFrame(function(){
        screen.addClass('visible');
      });  
    }