var _createClass = function () { 
  function defineProperties(target, props) { 
    for (var i = 0; i < props.length; i++) { 
      var descriptor = props[i]; 
      descriptor.enumerable = descriptor.enumerable || false; 
      descriptor.configurable = true; 
      if ("value" in descriptor) descriptor.writable = true; 
      Object.defineProperty(target, descriptor.key, descriptor); 
    } 
  } 
  return function (Constructor, protoProps, staticProps) { 
    if (protoProps) defineProperties(Constructor.prototype, protoProps); 
    if (staticProps) defineProperties(Constructor, staticProps); 
    return Constructor; 
  }; 
}();

function _classCallCheck(instance, Constructor) { 
  if (!(instance instanceof Constructor)) { 
    throw new TypeError("Cannot call a class as a function"); 
  } 
}

var Steps = function () {
  function Steps(wizard) {
    _classCallCheck(this, Steps);

    this.wizard = wizard;
    this.steps = this.getSteps();
    this.stepsQuantity = this.getStepsQuantity();
    this.currentStep = 0;
  }

  _createClass(Steps, [{
    key: 'setCurrentStep',
    value: function setCurrentStep(currentStep) {
      this.currentStep = currentStep;
    }
  }, {
    key: 'getSteps',
    value: function getSteps() {
      return this.wizard.getElementsByClassName('step');
    }
  }, {
    key: 'getStepsQuantity',
    value: function getStepsQuantity() {
      return this.getSteps().length;
    }
  }, {
    key: 'handleConcludeStep',
    value: function handleConcludeStep() {
      this.steps[this.currentStep].classList.add('-completed');
    }
  }, {
    key: 'handleStepsClasses',
    value: function handleStepsClasses(movement) {
      if (movement > 0) this.steps[this.currentStep - 1].classList.add('-completed');
      else if (movement < 0) this.steps[this.currentStep].classList.remove('-completed');
    }
  }]);

  return Steps;
}();

var Panels = function () {
  function Panels(wizard) {
    _classCallCheck(this, Panels);

    this.wizard = wizard;
    this.panelWidth = this.wizard.offsetWidth;
    this.panelsContainer = this.getPanelsContainer();
    this.panels = this.getPanels();
    this.currentStep = 0;

    this.updatePanelsPosition(this.currentStep);
    this.updatePanelsContainerHeight();
  }

  _createClass(Panels, [{
    key: 'getCurrentPanelHeight',
    value: function getCurrentPanelHeight() {
      return this.getPanels()[this.currentStep].offsetHeight + 'px';
    }
  }, {
    key: 'getPanelsContainer',
    value: function getPanelsContainer() {
      return this.wizard.querySelector('.panels');
    }
  }, {
    key: 'getPanels',
    value: function getPanels() {
      return this.wizard.getElementsByClassName('panel');
    }
  }, {
    key: 'updatePanelsContainerHeight',
    value: function updatePanelsContainerHeight() {
      this.panelsContainer.style.height = this.getCurrentPanelHeight();
    }
  }, {
    // Moving Panels
    key: 'updatePanelsPosition',
    value: function updatePanelsPosition(currentStep) {
      var panels = this.panels;
      var panelWidth = this.panelWidth;

      for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('movingIn', 'movingOutBackward', 'movingOutFoward');

        if (i !== currentStep) {
          if (i < currentStep) panels[i].classList.add('movingOutBackward');
          else if (i > currentStep) panels[i].classList.add('movingOutFoward');
        } else {
          panels[i].classList.add('movingIn');
        }
      }

      this.updatePanelsContainerHeight();
    }
  }, {
    key: 'setCurrentStep',
    value: function setCurrentStep(currentStep) {
      this.currentStep = currentStep;
      this.updatePanelsPosition(currentStep);
    }
  }]);

  return Panels;
}();

var Wizard = function () {
  function Wizard(obj) {
    _classCallCheck(this, Wizard);

    this.wizard = obj;
    this.panels = new Panels(this.wizard);
    this.steps = new Steps(this.wizard);
    this.stepsQuantity = this.steps.getStepsQuantity();
    this.currentStep = this.steps.currentStep;

    this.concludeControlMoveStepMethod = this.steps.handleConcludeStep.bind(this.steps);
    this.wizardConclusionMethod = this.handleWizardConclusion.bind(this);
  }

  _createClass(Wizard, [{
    key: 'updateButtonsStatus',
    value: function updateButtonsStatus() {
      if (this.currentStep === 0) this.previousControl.classList.add('disabled');else this.previousControl.classList.remove('disabled');
    }
  }, {
    key: 'updtadeCurrentStep',
    value: function updtadeCurrentStep(movement) {
      this.currentStep += movement;
      this.steps.setCurrentStep(this.currentStep);
      this.panels.setCurrentStep(this.currentStep);

      this.handleNextStepButton();
      this.updateButtonsStatus();
    }
  }, {
    key: 'handleNextStepButton',
    value: function handleNextStepButton() {
      if (this.currentStep === this.stepsQuantity - 1) {
        this.nextControl.innerHTML = 'Confirm Order!';

        this.nextControl.removeEventListener('click', this.nextControlMoveStepMethod);
        this.nextControl.addEventListener('click', this.concludeControlMoveStepMethod);
        this.nextControl.addEventListener('click', this.wizardConclusionMethod);
        var x = document.getElementById("final_msg");
        if (x.style.display === "none") {
          x.style.display = "block";
        }

      } else {
        this.nextControl.innerHTML = 'Next';

        this.nextControl.addEventListener('click', this.nextControlMoveStepMethod);
        this.nextControl.removeEventListener('click', this.concludeControlMoveStepMethod);
        this.nextControl.removeEventListener('click', this.wizardConclusionMethod);
        $(function() {
            $('#final_msg').hide();
        });
      }
    }
  }, {
    key: 'handleWizardConclusion',
    value: function handleWizardConclusion() {
      this.wizard.classList.add('completed');
    }
  }, {
    key: 'addControls',
    value: function addControls(previousControl, nextControl) {
      this.previousControl = previousControl;
      this.nextControl = nextControl;
      this.previousControlMoveStepMethod = this.moveStep.bind(this, -1);
      this.nextControlMoveStepMethod = this.moveStep.bind(this, 1);

      previousControl.addEventListener('click', this.previousControlMoveStepMethod);
      nextControl.addEventListener('click', this.nextControlMoveStepMethod);

      this.updateButtonsStatus();
    }
  }, {
    key: 'moveStep',
    value: function moveStep(movement) {
      if (this.validateMovement(movement)) {
        this.updtadeCurrentStep(movement);
        this.steps.handleStepsClasses(movement);
      } else {
        throw 'This was an invalid movement';
      }
    }
  }, {
    key: 'validateMovement',
    value: function validateMovement(movement) {
      var fowardMov = movement > 0 && this.currentStep < this.stepsQuantity - 1;
      var backMov = movement < 0 && this.currentStep > 0;

      return fowardMov || backMov;
    }
  }]);

  return Wizard;
}();

var wizardElement = document.getElementById('wizard');
var wizard = new Wizard(wizardElement);
var buttonNext = document.querySelector('.next');
var buttonPrevious = document.querySelector('.previous');

wizard.addControls(buttonPrevious, buttonNext);

$(function() {
    $('#final_msg').hide();
});


// var but_test= document.getElementById('n_button');

// if (but_test.innerText == 'Order!') {
//   console.log("hello")
// }

function topFunction() {
  document.body.scrollTop = 15;
  document.documentElement.scrollTop = 15;
  event.preventDefault();
  $('html','body').animate({scrollTop:0},8000);
  return false;
}

// $(document).on('click','#n_button',function(event){
//   event.preventDefault();
//   $('html','body').animate({scrollTop:0},8000);

//   return false;
// });

$(document).ready(function(){
  $("#loc").click(function(){
    var input1 = $('#addrs');
    var input2 = $('#city');
    var input3 = $('#lndmrk');
    input1.val('Crowne Plaza Kathmandu-Soaltee, Tahachal Marg');
    input2.val('Kathmandu');
    input3.val('Crowne Plaza Kathmandu-Soaltee');
  });
});

var date = $('#datepicker').datepicker({ dateFormat: 'dd-mm-yy' }).val();

$( function() {
  $( ".date-picker" ).datepicker();
} );

// $('#datepicker').datepicker();



$(window).on('beforeunload', function(){
  // your logic here`enter code here`
  document.body.scrollTop = 15;
  document.documentElement.scrollTop = 15;
  event.preventDefault();
  $('html','body').animate({scrollTop:0},8000);
  // return false;
});


$("#book_end").on('click',function() {
    location.reload();
    console.log('hello');
});

$( "#time_resize" ).click(function() {
  $(".panels").addClass("long");
  $(".panel.movingIn").addClass("long");

  $("#p_button").on('click',function() {
    $(".panels").removeClass("long");
    $(".panel.movingIn").removeClass("long");
  });

  $("#n_button").on('click',function() {
    $(".panels").removeClass("long");
    $(".panel.movingIn").removeClass("long");
  });

  console.log('Hello');
});