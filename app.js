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

//Speech Recognition result
recognition.onresult = (event) => {
    console.log(event);
    const { resultIndex } = event;
    const { transcript } = event.results[resultIndex][0];
    // console.log(`You just said ${transcript}`);
    // readOut(`You just said ${transcript}`);
    // transcript = transcript.toLowerCase();
    if (transcript.includes('hi') || transcript.includes("hey") || transcript.includes('hello')) {
        readOut('Hello Sai. How can I help you today?');
    }
    if (transcript.includes('open YouTube')) {
        console.log(`You said ${transcript}`);
        readOut("Opening Youtube");
        window.open('https://www.youtube.com');
    }
    if (transcript.includes('open Google')) {
        console.log(`You said ${transcript}`);
        readOut("Opening Google");
        window.open('https://www.google.com');
    }
    if (transcript.includes("Amazon")) {
        if (transcript.includes('open my Amazon')) {
            console.log(`You said ${transcript}`);
            readOut("Opening your amazon account");
            window.open('https://www.amazon.in');
        }
        else if (transcript.includes('open Amazon music')) {
            console.log(`You said ${transcript}`);
            readOut("Opening your Amazon Music");
            window.open('https://music.amazon.in/');
        }
        else if (transcript.includes('open Amazon Prime video')) {
            console.log(`You said ${transcript}`);
            readOut("Opening your Amazon Prime Video");
            window.open('https://www.primevideo.com/');
        }
        else {
            console.log(`You said ${transcript}`);
            readOut("Opening Amazon");
            window.open('https://www.amazon.com');
        }
    }
    if(transcript.includes('open my Netflix')){
        console.log(`You said ${transcript}`);
        readOut("Opening your Netflix account");
        window.open('https://www.netflix.com/browse');
    }
    if(transcript.includes('open my Github')){
        console.log(`You said ${transcript}`);
        readOut("Opening your Github account");
        window.open('https://github.com/sailakshmy');
    }
    if(transcript.includes('open my portfolio')){
        console.log(`You said ${transcript}`);
        readOut("Opening your portfolio");
        window.open('https://sailakshmy-portfolio.herokuapp.com/');
    }
    if(transcript.includes('open my official Gmail inbox')){
        console.log(`You said ${transcript}`);
        readOut("Opening your official gmail inbox");
        window.open('https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox');
    }
    if(transcript.includes('open my other Gmail inbox')){
        console.log(`You said ${transcript}`);
        readOut("Opening your gmail inbox");
        window.open('https://mail.google.com/mail/u/0/?ogbl#inbox');
    }
}


//Speech Recognition end
recognition.onend = () => {
    console.log("VR Inactive");
}

//To continously recognise the speech input
// recognition.continuous = true;

//Linking the elements to the start and stop functionalities
startButton.addEventListener('click', () => { recognition.start() });
stopButton.addEventListener('click', () => { recognition.stop() });

//EDITH's Speech
const readOut = (message) => {
    const edithSays = new SpeechSynthesisUtterance();
    // To access the different voices available
    const allVoices = speechSynthesis.getVoices();
    if (allVoices.length > 0) edithSays.voice = allVoices[2];
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
window.onload = () => readOut('');