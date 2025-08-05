const buttons= document.querySelectorAll('.tab-btn'); //doc.queSelAll grabs the elements that match a CSS selector
const sections= document.querySelectorAll('.tab-section'); //both buttons and sections grab the content. button grabs the ones with class=.tab-bth and sections with main area IDs

buttons.forEach(btn =>{
    btn.addEventListener('click', ()=>{ //this means that for each button, listen for the click. Once clicked the code inside the arrow function runs (both lines)
        const target = btn.dataset.tab; //this grabs the value of the date-tab attribute from the click button
        sections.forEach(section =>{
            section.classList.toggle('hidden', section.id !== target); //this section adds the hidden class if the id does not match target and removes the hidden class if it does match.
        });//This gives a simple-tab-switching system - one section visible at a time.
    });
});

//Add the phrases.json file functions!! (more than these two lines)
let phrasesData = {};
let currentCategory = "greetings";

//Load the JSON data
fetch('phrases.json').then(res => res.json()).then(data=>{
    phrasesData = data;
    renderCategoryButtons();
    renderPhrases(currentCategory);
})

//Render buttons for each category
function renderCategoryButtons(){
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    Object.keys(phrasesData).forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        btn.className = 'bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded';
        btn.addEventListener('click', ()=>{
            currentCategory = category;
            renderPhrases(category);
        });
        container.appendChild(btn);
    })
}

//Render phrases for the selected category
function renderPhrases(category) {
    const list = document.getElementById('phrase-list');
    list.innerHTML = '';
    const phrases = phrasesData[category];
    phrases.forEach(phrase => {
        const card = document.createElement('div');
        card.className = 'border p-3 rounded shadow-sm bg-white';
        card.innerHTML = `
            <p><strong>EN:<strong> ${phrase.english}</p>
            <p><strong>FR:<strong> ${phrase.french}</p>
            ${phrase.phonetic ? `<p><strong>Phonetic:</strong> ${phrase.phonetic}</p>` : ''}
        `;
        list.appendChild(card);
    })
}

//Currency section
const convertBtn = document.getElementById('convert-btn');
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultDisplay = document.getElementById('result');

//This is the function ran when the button is clicked
convertBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  const apiUrl = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
  console.log("Using URL:", apiUrl);

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
  console.log("API Response:", data);

  const converted = data.rates[to];
  resultDisplay.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
})

    .catch(error => {
      resultDisplay.textContent = "Something went wrong with the conversion.";
      console.error(error);
    });
});

//Emergency Section Code
// document.querySelectorAll('.tab-btn').forEach(button => {
//     button.addEventListener('click', ()=>{
//         const target = button.getAttribute('data-tab');

//         document.querySelectorAll('.tab-section').forEach(section =>{
//             section.classList.add('hidden');
//         });

//         const activeSection = document.getElementById(target);
//         if (activeSection){
//             activeSection.classList.remove('hidden');
//         }
//     })
// })

//Tap to pronunciation
function speak(text){
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

//copy to clipboard text
function copyText(text){
    navigator.clipboard.writeText(text).then(() =>{
        showToast('Copied!');
    })
    .catch(err => {
        showToast('Failed to copy');
        console.error(err);
    })
}

function showToast(message) {
  const toast = document.getElementById('copy-toast');
  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000); // Hide after 3 seconds
}
//Weather Section Start Code
let apiKey = "YOUR_API_KEY_HERE"; // Default fallback

try {
  const config = await import('./config.js');
  apiKey = config.apiKey;
} catch (error) {
  alert("Missing config.js or API key. Please follow setup instructions in the README.");
}

// Weather Section Elements
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherResult = document.getElementById('weatherResult');
const weatherCity = document.getElementById('weatherCity');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');

// Get Weather on Button Click
getWeatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Fetch Weather from OpenWeatherMap
function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      weatherResult.classList.remove('hidden');
      weatherCity.textContent = '';
      weatherTemp.textContent = '';
      weatherDesc.textContent = 'Error: ' + error.message;
    });
}

// Display Results
function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;

  weatherCity.textContent = data.name;
  weatherTemp.textContent = `${temp}°C`;
  weatherDesc.textContent = capitalize(description);
  weatherResult.classList.remove('hidden');
}

// Capitalize first letter
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
