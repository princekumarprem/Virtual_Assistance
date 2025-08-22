let btn = document.querySelector("#btn")
let content = document.querySelector("#content")
let voice = document.querySelector("#voice")

// Speak function
function speak(text){
    window.speechSynthesis.cancel(); // stop any ongoing speech before new one
    let text_speak = new SpeechSynthesisUtterance(text)
    text_speak.rate = 1
    text_speak.pitch = 1
    text_speak.volume = 1
    text_speak.lang = "en-GB"   // you can change to "en-US" or "hi-IN"
    window.speechSynthesis.speak(text_speak)
}

// Wish based on time
function wishMe(){
    let day = new Date()
    let hours = day.getHours()
    if(hours >= 0 && hours < 12){
        speak("Good Morning Sir")
    }
    else if(hours >= 12 && hours < 16){
        speak("Good Afternoon Sir")
    } else {
        speak("Good Evening Sir")
    }
}

// Run wishMe when page loads
window.addEventListener('load', () => {
    wishMe()
})

// Setup SpeechRecognition
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = new speechRecognition()

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex
    let transcript = event.results[currentIndex][0].transcript
    content.innerText = transcript
    takeCommand(transcript.toLowerCase())
}

// When recognition stops (mic off)
recognition.onend = () => {
    btn.style.display = "block"   // show button again
    voice.style.display = "none"  // hide gif
}

// Start listening when button clicked
btn.addEventListener("click", () => {
    recognition.start()
    btn.style.display = "none"      // hide the button
    voice.style.display = "block"   // show the gif/voice animation
})

// Weather function
async function getWeather(city = "Delhi") {
    let apiKey = "a1d44204ddee7be6f78b600592c8cd4b";  // ✅ Tumhara API key
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        console.log("Weather API Response:", data); // 👈 Console me check karna

        if (response.ok && data.cod === 200) {
            let temp = data.main.temp;
            let condition = data.weather[0].description;
            let result = `Sir, the current weather in ${city} is ${condition} with ${temp} degree Celsius.`;
            speak(result);   // 👈 Ye tumhari Shipra voice wale function ko call karega
        } else {
            speak(`Sorry sir, I could not fetch the weather for ${city}. Error: ${data.message}`);
        }
    } catch (error) {
        speak("Sorry sir, there was an error fetching the weather.");
        console.error("Weather API Error:", error);
    }
}

// Take command
function takeCommand(message){
    btn.style.display = "block"     // show the button
    voice.style.display = "none"    // hide gif
    message = message.toLowerCase()

    if(message.includes("hello") || message.includes("hii")){
        speak("Hello sir, what can I help you with?")
    }
    else if(message.includes("who are you")){
        speak("I am Shipra, your virtual assistant, created by Prince Rajput")
    }
    else if(message.includes("open youtube")){
        speak("Opening YouTube....")
        window.open("https://www.youtube.com/","_blank")
    }
    else if(message.includes("open chatgpt")){
        speak("Opening ChatGPT....")
        window.open("https://chat.openai.com/","_blank")
    }
    else if(message.includes("open google")){
        speak("Opening Google....")
        window.open("https://www.google.com/","_blank")
    }
    else if(message.includes("open instagram")){
        speak("Opening Instagram....")
        window.open("https://www.instagram.com/","_blank")
    }
    else if(message.includes("open facebook")){
        speak("Opening Facebook....")
        window.open("https://www.facebook.com/","_blank")
    }
    else if(message.includes("time")){   // 🕒 tell time
        let time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        speak("Sir, the time is " + time)
    }
    else if(message.includes("date")){   // 📅 tell date
        let today = new Date()
        let date = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear()
        speak("Sir, today's date is " + date)
    }
    else if(message.includes("weather") || message.includes("temperature")){  
        getWeather("Delhi");  // abhi fix Delhi
    }
    else{
        speak("Here are the search results from Google")
        window.open("https://www.google.com/search?q=" + encodeURIComponent(message), "_blank")
    }
}
