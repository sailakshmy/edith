//Elements
const startButton = document.querySelector("#Start");
const stopButton = document.querySelector("#Stop");
const speakButton = document.querySelector("#Speak");


//Speech Recognition setup
// window.SpeechRecognition -The voice Recognition API present in the browser
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

//Speech Recognition start
recognition.onstart = () => {
    console.log("VR Active");
}

//Speech Recognition end
recognition.onend = () => {
    console.log("VR Inactive");
}

//To continously recognise the speech input
recognition.continuous = true;

//Linking the elements to the start and stop functionalities
startButton.addEventListener('click', () => { recognition.start() });
stopButton.addEventListener('click', () => { recognition.stop() });

//EDITH's Speech
const readOut = (message) => {
    const edithSays = new SpeechSynthesisUtterance();
    // To access the different voices available
    const allVoices = speechSynthesis.getVoices();
    if (allVoices.length > 0)  edithSays.voice = allVoices[2];
        //Edith is expected to say the message that is passed as the parameter
        edithSays.text = message;
        edithSays.volume = 2;
        window.speechSynthesis.speak(edithSays);
        console.log('Speaking out');
}

speakButton.addEventListener('click', () => { readOut("Hello Sai! Thank you for creating me! How can I help you today?") });
// There is an issue where the getVoices() method takes some time to return the voices. So the voice 
// reads the statement in the default voice on the first click and on the second click in the assigned voice.
// As a workaround, we are reading out an empty string on the first load, so that it reads it in the
// assigned voice on the first click itself.
window.onload = () =>readOut('');