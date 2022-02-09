//API Key for openweathermap API
const API_KEY = 'c49d01a76d795c52d73d41825c277be6';
// API key for newsAPi
const NEWS_API_KEY = '25f44d52217d4a95a765fa181960edb8';


//Time Statement
let timeStatement = '';

// Battery Statement
let batteryStatement = '';

// Network Statement
let networkStatement = '';

// Date details
const { language } = navigator;
const date = new Date();
const hrs = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();
const today = date.getDate();
const day = date.toLocaleString(language, { weekday: 'long' });
const month = date.toLocaleString(language, { month: 'long' });
const mm = date.getMonth();
const year = date.getFullYear();
let dateStatement = '';

//Elements
const time = document.querySelector('#time');
const network = document.querySelector('#network');
const battery = document.querySelector('#battery');
const startEdithButton = document.querySelector("#start_edith");
const commandsContainer = document.querySelector('.commands');
const messages = document.querySelector('.messages');
const closeCommandsList = document.querySelector('#CloseCommandsButton');
const addNewField = document.querySelector('#add_new_field');
const inputFields = document.querySelector('.inputFields');


// Commands for EDITH
// const categoryCommands = [];
const commands = [];
// const greetingCommands = [];
commands.push('hi');
commands.push('hey');
commands.push('hello');
// greetingCommands.push(commands);
// categoryCommands.push({'greetings':greetingCommands});
commands.push('open YouTube');
commands.push('open Google');
commands.push('open my Amazon');
commands.push('open Amazon music');
commands.push('open Amazon Prime video');
commands.push('open Amazon');
commands.push('open my Netflix account');
commands.push('open my GitHub account');
commands.push('open my portfolio');
commands.push('open my Linkedin profile');
commands.push('open my official Gmail inbox');
commands.push('open my other Gmail inbox');
commands.push('open my firebase console');
commands.push('search for ___________');
commands.push('what is ________________');
commands.push('search for _____________ on Youtube');
commands.push('edit my profile');
commands.push('show me your commands');
commands.push('what are the commands that you can interpret?');
commands.push('close your commands list');
commands.push('close your command list');
commands.push('Give me the weather details in ___________');
commands.push("What's the time?");
commands.push("What's my battery status?");
commands.push("What's my network status?");
commands.push("What's the date today?");
commands.push("Show me today's date");
commands.push('Show me the news');
commands.push("What's today's news?");
commands.push("Give me the top ______ news headlines");
commands.push("Show me the top ________________ news headlines related to __________");
commands.push("Show me the top ________________ news headlines from the ___________ category");
commands.push('close tabs');
commands.push('Shut down');
commands.push('Take a nap');
// console.log(categoryCommands);

const commandList = document.createElement('ul');
commands.forEach(command => {
    var commandItem = document.createElement('li');
    commandItem.textContent = command;
    commandList.appendChild(commandItem);
});

//EDITH User setup
const userInfo = {
    name: "",
    nickname: '',
    portfolio: '',
    githubProfile: '',
    linkedInProfile: '',
    location: '',
};

// Array of all opened tabs
const browserTabs = [];

// Accessing the user's IPAddress to fetch the city and obtain weather details
const getUserLocation = () => {
    if (navigator.geolocation) {
        const wifiURL = `https://ipapi.co/json/`;
        return fetch(wifiURL)
            .then(response => response.json())
            .then(data => {
                userInfo.location = data.city;
                getWeatherDetails(userInfo.location);
            })
            .catch(e => {
                console.log(e);
            });
    }
    else {
        readOut('Sorry, Looks like your browser does not support location detection due to which I am facing issues in accessing your location, so your weather details may not be available. You could ask me the weather details using the command - Give me the weather details in "city name"');
    }
}
// Format time
const formatTime = (time) => {
    if (time < 10)
        return `0${time}`
    else return time;
}

// To fetch news 
const getNewsUpdates = async (topNumber) => {
    const newsURL = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${NEWS_API_KEY}`;
    await fetch(newsURL).then(res => res.json()).then(data => {
        const { articles } = data;
        // console.log(data);
        // readOut(articles[0].title);
        // messageDisplay("edith", articles[0].url, true);
        if (topNumber != null && topNumber <= articles.length) {
            readOut(`Here's the top ${topNumber} news for now.`);
            for (let i = 0; i < topNumber; i++) {
                readOut(`${i + 1}... ${articles[i].title}`);
                messageDisplay("edith", articles[i].url, true);
            }
        }
        else {
            readOut(`These are the news headlines for today.`)
            articles.forEach((article, index) => {
                readOut(`${index + 1}... ${article.title}`);
                messageDisplay("edith", article.url, true);
            });
        }
    });
}

// To fetch specific topic news
const getSpecificNewsUpdates = async (category, topNumber) => {
    const specificNewsURL = `https://newsapi.org/v2/everything?q=${category}&from=${year}-${mm}-${today}&sortBy=popularity&apiKey=${NEWS_API_KEY}`;
    await fetch(specificNewsURL).then(res => res.json()).then(data => {
        const { articles } = data;
        if (topNumber != null && topNumber <= articles.length) {
            readOut(`Here's the top ${topNumber} news related to ${category}.`);
            for (let i = 0; i < topNumber; i++) {
                readOut(`${i + 1}... ${articles[i].title}`);
                messageDisplay("edith", articles[i].url, true);
            }
        }
        else {
            readOut(`These are the news headlines in the ${category} category for today.`)
            articles.forEach((article, index) => {
                readOut(`${index + 1}... ${article.title}`);
                messageDisplay("edith", article.url, true);
            });
        }
    });
}

// Providing user a manual to access the application
const readyToGo = (saveDetailsFirstTime) => {
    if (saveDetailsFirstTime)
        readOut(`Hello ${userInfo.nickname}. Good day to you. I am EDITH, your voice assistant. In order to see what I can do, please click on the Start Recognition button and say the words - Show me your commands list.`);
    startEdithButton.childNodes[3].innerText = "Start Recognition";
}

/**The user details will be stored in LocalStorage */
const edithUserSetup = document.querySelector('.edith_setup');
edithUserSetup.style.display = "none";
let saveDetailsFirstTime = false;


// Submit user info
const submitUserInfo = (e) => {
    e.preventDefault();
    // Access the user information provided via the form
    let hasAllFormValues = true;
    // Check if all the form fields have been submitted by the user.
    edithUserSetup.querySelectorAll('input').forEach(item => {
        if (!item.value) {
            readOut(`Sorry! You have not filled all the fields`);
            hasAllFormValues = false;
        }
    });
    if (hasAllFormValues) {
        console.log("Out of the forEach loop");
        if (localStorage.getItem('edith_setup') === null)
            readOut('Thank you for providing the details. This will help me to personalize your experience');
        userInfo.name = edithUserSetup.querySelector('#UserName').value;
        userInfo.nickname = edithUserSetup.querySelector('#Nickname').value;
        userInfo.portfolio = edithUserSetup.querySelector('#portfolio').value;
        userInfo.githubProfile = edithUserSetup.querySelector('#githubProfile').value;
        userInfo.linkedInProfile = edithUserSetup.querySelector('#LinkedInProfile').value;
        // clear the localStorage
        localStorage.clear();
        // Set the user details in local storage
        localStorage.setItem('edith_setup', JSON.stringify(userInfo));
        // After the details are saved in localStorage, hide the form
        edithUserSetup.style.display = "none";
        readyToGo(saveDetailsFirstTime);
        if (saveDetailsFirstTime)
            readOut('I will be accessing your location to fetch the weather details in your city.');
        getUserLocation();
    }
}

if (localStorage.getItem('edith_setup') === null) {
    edithUserSetup.style.display = "block";
    saveDetailsFirstTime = true;
    // edithUserSetup.style.display = "flex";
}
if (localStorage.getItem('edith_setup') !== null) { // This is to check if the user has already used the application before
    // If it is a first time user, only then the form for the user's details will be shown. Else, the user's details will be fetched from 
    // the local storage.
    // console.log(localStorage.getItem('edith_setup'));
    saveDetailsFirstTime = false;

}
edithUserSetup.addEventListener('submit', submitUserInfo);
addNewField.addEventListener('click', () => {
    const labelInputTag = document.createElement('input');
    labelInputTag.setAttribute('type', "text");
    labelInputTag.setAttribute('required', true);
    labelInputTag.setAttribute('placeholder', "Please give a suitable label/key so that I can help you access the respective link");
    const inputFieldTag = document.createElement('input');
    inputFieldTag.setAttribute('type', "text");
    inputFieldTag.setAttribute('disabled', true);
    inputFields.appendChild(labelInputTag);
    inputFields.appendChild(inputFieldTag);
    labelInputTag.onchange = function (e) {
        labelInputTag.value = e.target.value;
        if (labelInputTag.value !== '')
            inputFieldTag.removeAttribute('disabled');
    };
    inputFieldTag.onchange = function (e) {
        if (labelInputTag.value === '') {
            readOut('Please enter a label for this field first');
        } else {
            inputFieldTag.value = e.target.value;
        }
        if (labelInputTag.value !== '' && inputFieldTag.value !== '') {
            userInfo[labelInputTag.value] = inputFieldTag.value;
            console.log(userInfo);
        }
    }
});

//Weather details
let weatherStatement = '';
const fahrenheit = (temp) => (temp * 1.8 - 459.67).toFixed(2);
const celsius = (temp) => (temp - 273.15).toFixed(2);
const getWeatherDetails = (location) => {
    const weatherContainer = document.querySelector(".temperature").querySelectorAll("*");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", url, true);
    xmlHttpRequest.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            weatherStatement = `Sai, the weather in ${location} is ${data.weather[0].description}. The current temperature is ${celsius(data.main.temp)} degrees Celsius, but it feels like ${celsius(data.main.feels_like)} degrees Celsius. 
            You can expect a maximum temperature of ${celsius(data.main.temp_max)} degrees Celsius today and the minimum temperatures can fall down to ${celsius(data.main.temp_min)} degrees Celsius.`
            // The UI will be updated only if the  location is the same as the user's location.
            if (location === userInfo.location) {
                weatherContainer[0].textContent = `Location: ${data.name}`;
                weatherContainer[1].textContent = `Country: ${data.sys.country}`;
                weatherContainer[2].textContent = `Weather Type: ${data.weather[0].main}`;
                weatherContainer[3].textContent = `Description: ${data.weather[0].description}`;
                weatherContainer[4].src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
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
            }
            else {
                readOut(weatherStatement);
            }
            // console.log(weatherStatement)
        }
        else {
            weatherContainer[0].textContent = `Weather Info Not Found`;
            weatherStatement = `Sorry Sai. I am unable to retrieve the weather information for ${location}. Please try again later.`
            readOut(weatherStatement);
        }
    };
    xmlHttpRequest.send()
}

// Redirect to Google calendar
document.querySelector('.calendar').addEventListener('click', () => {
    if (userInfo.nickname.includes('Sai')) {
        const tab = window.open('https://calendar.google.com/calendar/u/0/r?tab=rc');
        browserTabs.push(tab);
    }
});

// Message playback/display on screen
const messageDisplay = (speaker, msg, link = false) => {
    if (speaker === "user" && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    if (!link) {
        const messageElement = document.createElement('p');
        messageElement.innerText = msg;
        messageElement.setAttribute('class', speaker);
        messages.appendChild(messageElement);
    } else {
        const linkElement = document.createElement('a');
        // linkElement.href = msg;
        linkElement.innerText = msg;
        linkElement.setAttribute('target', "_blank");
        linkElement.setAttribute('class', "edith_link");
        messages.appendChild(linkElement);
        linkElement.addEventListener('click', () => {
            const tab = window.open(msg);
            browserTabs.push(tab);
        })
    }
}

//Speech Recognition setup
// window.SpeechRecognition -The voice Recognition API present in the browser
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let isRecognitionOn = false;

//Speech Recognition start
recognition.onstart = () => {
    //    console.log(startEdithButton.childNodes);
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    startEdithButton.childNodes[3].innerText = "Stop Recognition";
    isRecognitionOn = true;
}

//Speech Recognition result
recognition.onresult = (event) => {
    // console.log(event);
    const { resultIndex } = event;
    const { transcript } = event.results[resultIndex][0];
    // console.log(`You said ${transcript}`);
    messageDisplay("user", transcript);
    if (transcript.includes('hi') || transcript.includes("hey") || transcript.includes('hello')) {
        readOut(`Hello ${edithUserSetup.querySelector('#Nickname').value ? edithUserSetup.querySelector('#Nickname').value : ''}. How can I help you today?`);
    }
    if (transcript.includes('open YouTube') || transcript.includes('Open YouTube')) {
        console.log(`You said ${transcript}`);
        readOut("Opening Youtube");
        const openedTab = window.open('https://www.youtube.com');
        browserTabs.push(openedTab);
    }
    if (transcript.includes('open Google') || transcript.includes('Open Google')) {
        console.log(`You said ${transcript}`);
        readOut("Opening Google");
        const tab = window.open('https://www.google.com');
        browserTabs.push(tab);
    }
    if (transcript.includes("Amazon")) {
        if (userInfo.nickname.includes('Sai')) {
            if (transcript.includes('open my Amazon') || transcript.includes('Open my Amazon')) {
                console.log(`You said ${transcript}`);
                readOut("Opening your amazon account");
                const tab = window.open('https://www.amazon.in');
                browserTabs.push(tab);
            }
            else if (transcript.includes('open Amazon music') || transcript.includes('Open Amazon music')) {
                console.log(`You said ${transcript}`);
                readOut("Opening your Amazon Music");
                const tab = window.open('https://music.amazon.in/');
                browserTabs.push(tab);
            }
            else if (transcript.includes('open Amazon Prime video') || transcript.includes('Open Amazon Prime video')) {
                console.log(`You said ${transcript}`);
                readOut("Opening your Amazon Prime Video");
                const tab = window.open('https://www.primevideo.com/');
                browserTabs.push(tab);
            }
        }
        else {
            console.log(`You said ${transcript}`);
            readOut("Opening Amazon");
            const tab = window.open('https://www.amazon.com');
            browserTabs.push(tab);
        }
    }
    if (transcript.includes('open my Netflix') || transcript.includes('Open my Netflix')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your Netflix account");
        const tab = window.open('https://www.netflix.com/browse');
        browserTabs.push(tab);

    }
    if (transcript.includes('open my GitHub') || transcript.includes('Open my GitHub')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your Github account");
        const tab = window.open(`${userInfo.githubProfile}`);
        browserTabs.push(tab);

    }
    if (transcript.includes('open my portfolio') || transcript.includes('Open my portfolio')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your portfolio");
        const tab = window.open(`${userInfo.portfolio}`);
        browserTabs.push(tab);

    }
    if (transcript.includes('open my Linkedin profile') || transcript.includes('Open my Linkedin profile')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your LinkedIn profile");
        const tab = window.open(`${userInfo.linkedInProfile}`);
        browserTabs.push(tab);

    }
    if ((transcript.includes('open my official Gmail inbox') || transcript.includes('Open my official Gmail inbox')) && userInfo.nickname.includes('Sai')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your official gmail inbox");
        const tab = window.open('https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox');
        browserTabs.push(tab);

    }
    if ((transcript.includes('open my other Gmail inbox') || transcript.includes('Open my other Gmail inbox')) && userInfo.nickname.includes('Sai')) {
        console.log(`You said ${transcript}`);
        readOut("Opening leftme94 gmail inbox");
        const tab = window.open('https://mail.google.com/mail/u/1/?ogbl#inbox');
        browserTabs.push(tab);

    }
    if ((transcript.includes('open my firebase console') || transcript.includes('Open my firebase console')) && userInfo.nickname.includes('Sai')) {
        console.log(`You said ${transcript}`);
        readOut("Opening your firebase console");
        const tab = window.open('https://console.firebase.google.com/u/1/');
        browserTabs.push(tab);

    }
    if (transcript.includes('search for') || transcript.includes('what is') || transcript.includes('Search for') || transcript.includes('What is')) {
        console.log(`You said ${transcript}`);
        let searchKeyword = '';
        let searchKeywordArray = [];
        if ((transcript.includes('search for') || transcript.includes('Search for')) && !transcript.includes('YouTube')) {
            searchKeywordArray = transcript.split(' ').splice((transcript.indexOf('search') + 2));
            searchKeyword = searchKeywordArray.join("+");
        }
        else if (transcript.includes('what is') || transcript.includes('What is')) {
            searchKeywordArray = transcript.split(' ').splice((transcript.indexOf('what') + 2));
            searchKeyword = searchKeywordArray.join("+");
        }
        if (transcript.includes('YouTube')) {
            searchKeywordArray = transcript.split(' ').splice((transcript.indexOf('search') + 2));
            searchKeywordArray = searchKeywordArray.splice(0, (searchKeywordArray.indexOf('YouTube') - 1));
            searchKeyword = searchKeywordArray.join("+");
            readOut(`Opening search results for ${searchKeywordArray.join(" ")} on YouTube`);
            const tab = window.open(`https://www.youtube.com/results?search_query=${searchKeyword}`);
            browserTabs.push(tab);

        }
        else {
            readOut(`Opening search results for ${searchKeywordArray.join(" ")}`);
            const tab = window.open(`https://www.google.com/search?q=${searchKeyword}`);
            browserTabs.push(tab);
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
    if (transcript.includes('commands') || transcript.includes('command')) {
        if (transcript.includes('show') || transcript.includes('what')) {
            readOut('I can respond to the following commands only');
            commandsContainer.appendChild(commandList);
            commandsContainer.style.display = 'inline-block';
        } else if (transcript.includes('close')) {
            readOut('Closing my command list popup');
            commandsContainer.style.display = 'none';
            commandsContainer.removeChild();
        }
    }
    if (transcript.includes('weather')) {
        if (transcript.includes(userInfo.location))
            readOut(weatherStatement);
        else {
            const locationSearchKeyword = transcript.split(" ").pop();
            console.log(locationSearchKeyword);
            if (locationSearchKeyword.endsWith('?') || locationSearchKeyword.endsWith('.')) {
                getWeatherDetails(locationSearchKeyword.split("").splice(0, (locationSearchKeyword.length) - 1).join(""));
            }
            else {
                getWeatherDetails(locationSearchKeyword)
            }
            // readOut(weatherStatement);
        }
    }
    if (transcript.includes('close tabs') || transcript.includes('close tab') || transcript.includes('Close tabs') || transcript.includes('close all tabs')) {
        if (browserTabs.length > 0) {
            readOut('Closing all tabs that I have opened');
            browserTabs.forEach(window => window.close());
        } else {
            readOut('Sorry, I have not opened any new tabs for you.');
        }

    }
    if (transcript.includes('time')) {
        readOut(timeStatement);
    }
    if (transcript.includes('battery')) {
        readOut(batteryStatement);
    }
    if (transcript.includes('network')) {
        readOut(networkStatement);
    }
    if (transcript.includes('date today') || (transcript.includes("today's date"))) {
        readOut(dateStatement);
    }
    if (transcript.includes('news')) {
        const transcriptArray = transcript.split(" ");
        let category = '';
        if (transcript.includes('top')) {
            const topNumber = transcriptArray[(transcriptArray.indexOf('top')) + 1];
            if (transcript.includes('related to')) {
                category = transcriptArray[(transcriptArray.indexOf('related')) + 2];
                getSpecificNewsUpdates(category, topNumber);
            } else if (transcript.includes('category')) {
                category = transcriptArray[(transcriptArray.indexOf('category')) - 1];
                getSpecificNewsUpdates(category, topNumber);
            } else
                getNewsUpdates(parseInt(topNumber));
        }
        else {
            if (transcript.includes('related to')) {
                category = transcriptArray[(transcriptArray.indexOf('related')) + 2];
                getSpecificNewsUpdates(category);
            } else if (transcript.includes('category')) {
                category = transcriptArray[(transcriptArray.indexOf('category')) - 1];
                getSpecificNewsUpdates(category);
            } else {
                // Get News Updates
                getNewsUpdates();
            }
        }
    }
    if (transcript.includes('shut down') || transcript.includes('Shut down') || transcript.includes('shutdown') || transcript.includes('take a nap') || transcript.includes('Take a nap')) {
        readOut('Okay, I will take a nap.');
        recognition.stop();
    }
    // else{
    //     readOut('Sorry, I did not understand your command. Would you please repeat it?. You could also take a look at the commands that I can interpret by saying-show me your commands');
    // }
    // console.log(browserTabs);
}


//Speech Recognition end
recognition.onend = () => {
    startEdithButton.childNodes[3].innerText = "Start Recognition";
    isRecognitionOn = false;
}

// To continously recognise the speech input
// recognition.continuous = true;

//Linking the elements to the start and stop functionalities
// startButton.addEventListener('click', () => { recognition.start() });
// stopButton.addEventListener('click', () => { recognition.stop() });
startEdithButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        if (!isRecognitionOn)
            recognition.start();
        else recognition.stop();
    }).catch(err => {
        readOut('Sorry, You have not granted me permission to access your microphone.');
    })
});
closeCommandsList.addEventListener('click', () => {
    readOut('Closing my command list popup');
    commandsContainer.style.display = 'none';
    commandsContainer.removeChild();
});

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
    messageDisplay("edith", message);
    // console.log('Speaking out');
}

// speakButton.addEventListener('click', () => { readOut("Hello Sai! Thank you for creating me! How can I help you today?") });
// There is an issue where the getVoices() method takes some time to return the voices. So the voice 
// reads the statement in the default voice on the first click and on the second click in the assigned voice.
// As a workaround, we are reading out an empty string on the first load, so that it reads it in the
// assigned voice on the first click itself.
window.onload = () => {
    // To play the bootup audio
    if (localStorage.getItem('edith_setup') !== null) {
        // This is done to ensure that the audio is played only after the user submits details
        const bootUp = document.createElement('audio');
        bootUp.setAttribute('src', './assets/Jarvis boot up.mp3');
        bootUp.setAttribute('autoplay', true);
        document.body.appendChild(bootUp);
        setTimeout(() => {
            const storageData = JSON.parse(localStorage.getItem('edith_setup'));
            userInfo.name = storageData.name;
            userInfo.nickname = storageData.nickname;
            userInfo.linkedInProfile = storageData.linkedInProfile;
            userInfo.githubProfile = storageData.githubProfile;
            userInfo.portfolio = storageData.portfolio;
            // This is to guide the user on what the application can do.
            readyToGo(saveDetailsFirstTime);
            readOut('I will be accessing your location to fetch the weather details in your city.');
            getUserLocation();
        }, 11000);
    } else if (localStorage.getItem('edith_setup') === null) {
        setTimeout(() => {
            readOut("Please fill out the form on the screen so that I can personalize your experience.");
        }, 1000)

    }
    readOut('');

    // Displaying the battery and network details
    navigator.getBattery().then(batteryDetails => {
        setInterval(() => {
            const batteryLevel = Math.floor(batteryDetails.level * 100);
            battery.style.width = batteryDetails.charging ? "175px" : "125px";
            battery.textContent = `${batteryLevel}% ${batteryDetails.charging ? " - Charging" : ''}`;
            batteryStatement = `${batteryDetails.charging ? `You are connected to a power source and have ${batteryLevel} % battery currently.` : `You have ${batteryLevel}% battery left`}`;
            network.textContent = `${navigator.onLine ? 'Online' : 'Offline'}`;
            networkStatement = `${navigator.onLine ? 'You are currently online' : ' Sorry. looks like you are not connected to any network'}`;
            if (batteryLevel <= 25 && !batteryDetails.charging) {
                readOut('DamnIt! Looks like I am going to run out of energy soon. Please connect me to a power source.');
            }
        }, 11000);
    });


    // Displays the current time on load of page
    document.querySelector('#month').innerText = month;
    document.querySelector('#day').innerText = day;
    document.querySelector('#date').innerText = today;
    document.querySelector('#year').innerText = year;
    dateStatement = `Today is the ${today}th day of ${month} in the year ${year} and it falls on a ${day}`;

    time.textContent = `${formatTime(hrs)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    timeStatement = `It is currently ${hrs} hours and ${minutes}minutes`;
    // Displays the updated time every 1000 ms
    setInterval(() => {
        const updatedDate = new Date();
        time.textContent = `${formatTime(updatedDate.getHours())}:${formatTime(updatedDate.getMinutes())}:${formatTime(updatedDate.getSeconds())}`;
        timeStatement = `It is currently ${updatedDate.getHours()} hours and ${updatedDate.getMinutes()}minutes`;
    }, 1000);
};