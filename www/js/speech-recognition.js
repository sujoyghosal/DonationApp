var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral",
  "crimson",
  "cyan",
  "fuchsia",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lime",
  "linen",
  "magenta",
  "maroon",
  "moccasin",
  "navy",
  "olive",
  "orange",
  "orchid",
  "peru",
  "pink",
  "plum",
  "purple",
  "red",
  "salmon",
  "sienna",
  "silver",
  "snow",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "white",
  "yellow",
];
var targetLang = document.getElementById("targetLang");
var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  var speechRecognitionList = new SpeechGrammarList();
  var grammar =
    "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = "bn-IN";
//recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.body.onclick = function () {
  alert("Speak");
  recognition.start();
  console.log("Ready to receive a color command.");
};

recognition.onresult = function (event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  alert(event.results[0][0].transcript);
  console.log("Confidence: " + event.results[0][0].confidence);
  socket.emit("speech", {
    text: event.results[0][0].transcript,
    //target: targetLang.value,
    target: "hi-IN",
  });
};

recognition.onspeechend = function () {
  recognition.stop();
};

recognition.onnomatch = function (event) {
  alert("I didn't recognise that color.");
};

recognition.onerror = function (event) {
  alert("Error occurred in recognition: " + event.error);
};
