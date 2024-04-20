/* 
PROYECTO FINAL - SISTEMAS INTERACTIVOS Y UBICUOS
ROSA REYES - 100434072
DAVID ROLDAN - 100451289
ELENA SERRANO - 100451094
*/

document.addEventListener('DOMContentLoaded', () => {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
  var SpeechRecognitionEvent =
    SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  var helpclauses = ['ayuda', 'ayúdame'];

  var recognition = new SpeechRecognition();
  if (SpeechGrammarList) {
    var speechRecognitionList = new SpeechGrammarList();
    var grammar =
      '#JSGF V1.0; grammar help; public <helping> = ' +
      helpclauses.join(' | ') +
      ' ;';
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }

  recognition.continuous = false;
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  console.log('Escuchando...');

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onend = function () {
    console.log('end');
    recognition.start();
  };

  recognition.onresult = function (event) {
    console.log('result');
    console.log(event);
    const result = event.results[0][0].transcript;
    console.log(`Resultado: ${result}.`);
    console.log(`Confianza: ${event.results[0][0].confidence}`);

    if (result === 'ayuda' || result === 'ayúdame') {
      const name = clientName;
      socket.emit('helpRequested', {
        name: name,
        message: `${name} pidió ayuda`,
      });
    }
  };

  recognition.onnomatch = function (event) {
    console.log('Sin coincidencias');
  };

  recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
  };
});
