//API Key for openweathermap API
const API_KEY = 'c49d01a76d795c52d73d41825c277be6';
const GOOGLE_API_KEY = 'AIzaSyCpKOWSFChdK6tD_Bx0tEDGue9s0BJoTMA';

//Elements
const startButton = document.querySelector("#Start");
const stopButton = document.querySelector("#Stop");
const speakButton = document.querySelector("#Speak");

//EDITH User setup

/**The user details will be stored in LocalStorage */
const edithUserSetup = document.querySelector('.edith_setup');
edithUserSetup.style.display = "none";
// Submit user info
const submitUserInfo = (e) => {
    e.preventDefault();
    // Access the user information provided via the form
    const hasAllFormValues = true;
    // Check if all the form fields have been submitted by the user.
    edithUserSetup.querySelectorAll('input').forEach(item => {
        if (!item.value) {
            readOut(`Sorry! You have not filled all the fields`);
            hasAllFormValues = false;
        }
    });
    if (hasAllFormValues) {
        console.log("Out of the forEach loop");
        const userInfo = {
            name: edithUserSetup.querySelector('#UserName').value,
            nickname: edithUserSetup.querySelector('#Nickname').value,
            portfolio: edithUserSetup.querySelector('#portfolio').value,
            githubProfile: edithUserSetup.querySelector('#githubProfile').value,
            linkedInProfile: edithUserSetup.querySelector('#LinkedInProfile').value,
            location: '',
        }
        // clear the localStorage
        localStorage.clear();
        // Set the user details in local storage
        localStorage.setItem('edith_setup', JSON.stringify(userInfo));
        // After the details are saved in localStorage, hide the form
        edithUserSetup.style.display = "none";

    }
}

// Access the user's location via Geolocation API
const locationSuccess = (position) => {
    readOut('I have your latitude and longitude');
    console.log(position);
    const {latitude,longitude} = position.coords;
    readOut(latitude);
    //40.714224,-73.961452
    const fetchLocationURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&amp;key=${API_KEY}`
    const locationXMLHttpRequest = new XMLHttpRequest();
    locationXMLHttpRequest.open("GET", fetchLocationURL, true);
    xmlHttpRequest.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            readOut('I have your location data');
            console.log("Data from locationURL");
            console.log(data);
        }
    }
}
const locationError = (error) => {
    if (error.code === 1) {
        console.log(error.message);
    }
}


if (localStorage.getItem('edith_setup') === null) {
    edithUserSetup.style.display = "block";
    // edithUserSetup.style.display = "flex";
}
if (localStorage.getItem('edith_setup') !== null) { // This is to check if the user has already used the application before
    // If it is a first time user, only then the form for the user's details will be shown. Else, the user's details will be fetched from 
    // the local storage.

}
edithUserSetup.addEventListener('submit', submitUserInfo);

//Weather details
let weatherStatement = '';
const fahrenheit = (temp) => (temp * 1.8 - 459.67).toFixed(2);
const celsius = (temp) => (temp - 273.15).toFixed(2);
const getWeatherDetails = (location) => {
    const weatherContainer = document.querySelector(".temp").querySelectorAll("*");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", url, true);
    xmlHttpRequest.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            weatherContainer[0].textContent = `Location: ${data.name}`;
            weatherContainer[1].textContent = `Country: ${data.sys.country}`;
            weatherContainer[2].textContent = `Weather Type: ${data.weather[0].main}`;
            weatherContainer[3].textContent = `Description: ${data.weather[0].description}`;
            weatherContainer[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            const tempTag = document.createElement("sup");
            const degreeSymbol = document.createTextNode('o');
            tempTag.appendChild(degreeSymbol);
            const celsiusSymbol = document.createTextNode('C');
            weatherContainer[5].textContent = `Current Temperature: ${celsius(data.main.temp)}`;
            weatherContainer[5].appendChild(tempTag);
            weatherContainer[5].appendChild(celsiusSymbol);
            weatherContainer[6].textContent = `Feels Like: ${celsius(data.main.feels_like)}`;
            weatherContainer[6].appendChild(tempTag);
            weatherContainer[6].appendChild(celsiusSymbol);
            weatherContainer[7].textContent = `Min Temperature: ${celsius(data.main.temp_min)}`;
            weatherContainer[7].appendChild(tempTag);
            weatherContainer[7].appendChild(celsiusSymbol);
            weatherContainer[8].textContent = `Max Temperature: ${celsius(data.main.temp_max)}`;
            weatherContainer[8].appendChild(tempTag);
            weatherContainer[8].appendChild(celsiusSymbol);
            weatherContainer[9].textContent = `Humidity: ${data.main.humidity}%`;
            weatherStatement = `Sai, the weather in ${location} is ${data.weather[0].description}. The current temperature is ${celsius(data.main.temp)} degrees Celsius, but it feels like ${celsius(data.main.feels_like)} degrees Celsius. 
            You can expect a maximum temperature of ${celsius(data.main.temp_max)} degrees Celsius today and the minimum temperatures can fall down to ${celsius(data.main.temp_min)} degrees Celsius.`
        }
        else {
            weatherContainer[0].textContent = `Weather Info Not Found`;
            weatherStatement = `Sorry Sai. I am unable to retrieve the weather information for ${location}. Please try again later.`
        }
    };
    xmlHttpRequest.send()
}

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
    // console.log(event);
    const { resultIndex } = event;
    const { transcript } = event.results[resultIndex][0];
    console.log(`You said ${transcript}`);

    if (transcript.includes('hi') || transcript.includes("hey") || transcript.includes('hello')) {
        readOut(`Hello ${edithUserSetup.querySelector('#Nickname').value ? edithUserSetup.querySelector('#Nickname').value : ''}. How can I help you today?`);
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
    if (transcript.includes('open my Netflix')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your Netflix account");
        window.open('https://www.netflix.com/browse');
    }
    if (transcript.includes('open my GitHub')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your Github account");
        window.open(`${edithUserSetup.querySelector('#githubProfile').value}`);
    }
    if (transcript.includes('open my portfolio')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your portfolio");
        window.open(`${edithUserSetup.querySelector('#portfolio').value}`);
    }
    if (transcript.includes('open my Linkedin profile')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your LinkedIn profile");
        window.open(`${edithUserSetup.querySelector('#LinkedInProfile').value}`);
    }

    if (transcript.includes('open my official Gmail inbox')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your official gmail inbox");
        window.open('https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox');
    }
    if (transcript.includes('open my other Gmail inbox')) {
        console.log(`You said ${transcript}`);
        readOut("Opening leftme94 gmail inbox");
        window.open('https://mail.google.com/mail/u/1/?ogbl#inbox');
    }
    if (transcript.includes('open my firebase console')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your firebase console");
        window.open('https://console.firebase.google.com/u/1/');
    }
    if (transcript.includes('search for') || transcript.includes('what is')) {
        console.log(`You said ${transcript}`);
        let searchKeyword = '';
        let searchKeywordArray = [];
        if (transcript.includes('search for') && !transcript.includes('YouTube')) {
            searchKeywordArray = transcript.split(' ').splice((transcript.indexOf('search') + 2));
            searchKeyword = searchKeywordArray.join("+");
        }
        else if (transcript.includes('what is')) {
            searchKeywordArray = transcript.split(' ').splice((transcript.indexOf('what') + 2));
            searchKeyword = searchKeywordArray.join("+");
        }
        if (transcript.includes('YouTube')) {
            searchKeywordArray = transcript.split(' ').splice((transcript.indexOf('search') + 2));
            searchKeywordArray = searchKeywordArray.splice(0, (searchKeywordArray.indexOf('YouTube') - 1));
            searchKeyword = searchKeywordArray.join("+");
            readOut(`Opening search results for ${searchKeywordArray.join(" ")} on YouTube`);
            window.open(`https://www.youtube.com/results?search_query=${searchKeyword}`);
        }
        else {
            readOut(`Opening search results for ${searchKeywordArray.join(" ")}`);
            window.open(`https://www.google.com/search?q=${searchKeyword}`);
        }
    }
    if (transcript.includes('my profile')) {
        if (transcript.includes('edit')) {
            console.log(`You said ${transcript}`);
            readOut("Displaying your profile details. Please let me know when you would like to save the details.");
            edithUserSetup.style.display = "block";
            const dataFromLocalStorage = JSON.parse(localStorage.getItem('edith_setup'))
            edithUserSetup.querySelector('#UserName').value = dataFromLocalStorage.name;
            edithUserSetup.querySelector('#Nickname').value = dataFromLocalStorage.nickname;
            edithUserSetup.querySelector('#portfolio').value = dataFromLocalStorage.portfolio;
            edithUserSetup.querySelector('#githubProfile').value = dataFromLocalStorage.githubProfile;
            edithUserSetup.querySelector('#LinkedInProfile').value = dataFromLocalStorage.linkedInProfile;
        }
        else if (transcript.includes('save')) {
            console.log(`You said ${transcript}`);
            readOut("Saving your profile details.");
            submitUserInfo();
        }
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
    // Edith is expected to say the message that is passed as the parameter
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
window.onload = () => {
    readOut('');
    // Check if the user's browser supports geolocation API
    if (navigator.geolocation) {
        console.log("Accessing the user's location");
        // console.log(navigator.geolocation);
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    } else {
        console.log("This browser does not support geolocation API");
    }
    readOut("Accessing your location");
};