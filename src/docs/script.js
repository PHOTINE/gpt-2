 var synth = window.speechSynthesis;

 function speak(gentext){
  
  var msg = new SpeechSynthesisUtterance(gentext);
  synth.speak(msg); 


 } 

function findByText(rootElement, text){
    var filter = {
        acceptNode: function(node){
            // look for nodes that are text_nodes and include the following string.
            if(node.nodeType === document.TEXT_NODE && node.nodeValue.includes(text)){
                 return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
        }
    }
    var nodes = [];
    var walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, filter, false);
    while(walker.nextNode()){
       //give me the element containing the node
       nodes.push(walker.currentNode.parentNode);
    }
    return nodes;
}

 function stop() {
  console.log("should be stopping");
  synth.cancel(); 
}

 function submit_ajax_post (parsed_input) {
    console.log("Submitted data is")
    console.log(parsed_input)
    console.log(JSON.stringify({"input_text": parsed_input}))
    $.ajax({
      type: "POST",
      url: "https://gpt-iwktphxjoq-nn.a.run.app",
      dataType: "json",
      data: JSON.stringify({"input_text": parsed_input}),

//        data: JSON.stringify(getOutputValues);
      beforeSend: function (data) {
        $('#generate-text').addClass("is-loading");
        $('#generate-text').prop("disabled", true);
      },
      success: function (data) {
        console.log("output data is")
        console.log(data)
        $('#generate-text').removeClass("is-loading");
        $('#generate-text').prop("disabled", false);
        $('#tutorial').remove();
        var gentext = data.text;
        if ($("#prefix").length & $("#prefix").val() != '') {
          var pattern = new RegExp('^' + $("#prefix").val(), 'g');
          var gentext = gentext.replace(pattern, '<strong>' + $("#prefix").val() + '</strong>');
        }

        var gentext = gentext.replace(/\n\n/g, "<div><br></div>").replace(/\n/g, "<div></div>");
        var html = '<div class=\"gen-box\">' + gentext + '</div><div class="gen-border"></div>';
        $(html).appendTo('#model-output').hide().fadeIn("slow");
        speak(gentext)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#generate-text').removeClass("is-loading");
        $('#generate-text').prop("disabled", false);
        $('#tutorial').remove();
        var html = '<div class="gen-box warning">There was an error generating the text! Please try again!</div><div class="gen-border"></div>';
        $(html).appendTo('#model-output').hide().fadeIn("slow");
      }
    });
    $('#clear-text').click(function (e) {
      $('#model-output').text('')
    });
    // https://stackoverflow.com/a/51478809
    $("#save-image").click(function () {
      html2canvas(document.querySelector('#model-output')).then(function (canvas) {
        saveAs(canvas.toDataURL(), 'gen_texts.png');
      });
    });

  }

  function getInputValues() {
    var inputs = {};
    $("textarea, input").each(function () {
      inputs[$(this).attr('id')] = $(this).val();
    });
    return inputs;
  }

  // https://stackoverflow.com/a/51478809
  function saveAs(uri, filename) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);

    } else {

      window.open(uri);

    }
  }


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

function changeText(content, divID){
	var myDiv = document.getElementById(divID);
	myDiv.innerHTML = content;
}

var diagnosticPara = document.querySelector('.output');
var testBtn = document.querySelector('button');
// var testBtn1 = findByText(document.body,'SomeText');
var testBtn2 = findByText(document.body,'Clear Texts')[0];
var parsed_input

function testSpeech() {
//testBtn.textContent = 'test in progress';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();
  var textContent = '';
  diagnosticPara.textContent = '';


  recognition.onresult = function(event) {
    var speechResult = event.results[0][0].transcript.toLowerCase();
    // textContent = speechResult
//    parsed_input = speechResult
    submit_ajax_post(speechResult)
    diagnosticPara.textContent = 'You said to her: ' + speechResult + '.';

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

// function getOutputValues() {
//    var output = {};
////    $("textarea, output").each(function () {
////      output$(this).attr('id')] = $(this).val();
////    });
//    return output;
//  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Record';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Talk to Her';

    diagnosticPara.textContent = 'Her was not able to hear you, please refresh your page and try again: ' + event.error ;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');

  }
  return textContent

// var synth = window.speechSynthesis;

// var inputForm = document.querySelector('form');
// var inputTxt = document.querySelector('.txt');
// var voiceSelect = document.querySelector('select');

// var pitch = document.querySelector('#pitch');
// var pitchValue = document.querySelector('.pitch-value');
// var rate = document.querySelector('#rate');
// var rateValue = document.querySelector('.rate-value');

// var voices = [];

// function populateVoiceList() {
//   voices = synth.getVoices();

//   for(i = 0; i < voices.length ; i++) {
//     var option = document.createElement('option');
//     option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
//     if(voices[i].default) {
//       option.textContent += ' -- DEFAULT';
//     }

//     option.setAttribute('data-lang', voices[i].lang);
//     option.setAttribute('data-name', voices[i].name);
//     voiceSelect.appendChild(option);
//   }
// }

// populateVoiceList();
// if (speechSynthesis.onvoiceschanged !== undefined) {
//   speechSynthesis.onvoiceschanged = populateVoiceList;
// }

// inputForm.onsubmit = function(event) {
//   event.preventDefault();

//   var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
//   var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
//   for(i = 0; i < voices.length ; i++) {
//     if(voices[i].name === selectedOption) {
//       utterThis.voice = voices[i];
//     }
//   }
//   utterThis.pitch = pitch.value;
//   utterThis.rate = rate.value;
//   synth.speak(utterThis);

//   inputTxt.blur();
}



