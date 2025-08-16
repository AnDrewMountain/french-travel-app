const buttons = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab-section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    sections.forEach(section => {
      section.classList.toggle('hidden', section.id !== target);
    });

    // Boot Learn on demand
    if (target === 'learn') initLearnSection();

    // Remember last tab
    try { localStorage.setItem('app:lastTab', JSON.stringify(target)); } catch {}
  });
});


//Add the phrases.json file functions!! (more than these two lines)
let phrasesData = {};
let currentCategory = "greetings";

//Load the JSON data
fetch("phrases.json")
  .then((res) => res.json())
  .then((data) => {
    phrasesData = data;
    renderCategoryButtons();
    renderPhrases(currentCategory);
  });

//Render buttons for each category
function renderCategoryButtons() {
  const container = document.getElementById("category-buttons");
  container.innerHTML = "";
  Object.keys(phrasesData).forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    btn.className = "bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded";
    btn.addEventListener("click", () => {
      currentCategory = category;
      renderPhrases(category);
    });
    container.appendChild(btn);
  });
}

//Render phrases for the selected category
function renderPhrases(category) {
  const list = document.getElementById("phrase-list");
  list.innerHTML = "";
  const phrases = phrasesData[category];
  phrases.forEach((phrase) => {
    const card = document.createElement("div");
    card.className = "border p-3 rounded shadow-sm bg-white";
    card.innerHTML = `
            <p><strong>EN:<strong> ${phrase.english}</p>
            <p><strong>FR:<strong> ${phrase.french}</p>
            ${
              phrase.phonetic
                ? `<p><strong>Phonetic:</strong> ${phrase.phonetic}</p>`
                : ""
            }
        `;
    list.appendChild(card);
  });
}

//Currency section
const convertBtn = document.getElementById("convert-btn");
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const resultDisplay = document.getElementById("result");

//This is the function ran when the button is clicked
convertBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  const apiUrl = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
  console.log("Using URL:", apiUrl);

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log("API Response:", data);

      const converted = data.rates[to];
      resultDisplay.textContent = `${amount} ${from} = ${converted.toFixed(
        2
      )} ${to}`;
    })

    .catch((error) => {
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

//copy to clipboard text
function copyText(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("Copied!");
    })
    .catch((err) => {
      showToast("Failed to copy");
      console.error(err);
    });
}

function showToast(message) {
  const toast = document.getElementById("copy-toast");
  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000); // Hide after 3 seconds
}
//Weather Section Start Code
let apiKey = "YOUR_API_KEY_HERE"; // Default fallback

(async () => {
  try {
    const mod = await import("./config.js");
    // support either named or default export
    apiKey =
      (mod && (mod.apiKey || (mod.default && mod.default.apiKey))) || apiKey;
  } catch (error) {
    console.warn("Missing config.js or API key. Using fallback.");
    // (Optional) alert if you really want a popup:
    // alert("Missing config.js or API key. Please follow setup instructions in the README.");
  }
})();

// Weather Section Elements
const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherResult = document.getElementById("weatherResult");
const weatherCity = document.getElementById("weatherCity");
const weatherTemp = document.getElementById("weatherTemp");
const weatherDesc = document.getElementById("weatherDesc");

// Get Weather on Button Click
getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Fetch Weather from OpenWeatherMap
function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      weatherResult.classList.remove("hidden");
      weatherCity.textContent = "";
      weatherTemp.textContent = "";
      weatherDesc.textContent = "Error: " + error.message;
    });
}

// Display Results
function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;

  weatherCity.textContent = data.name;
  weatherTemp.textContent = `${temp}°C`;
  weatherDesc.textContent = capitalize(description);
  weatherResult.classList.remove("hidden");
}

// Capitalize first letter
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

//Learn Section

// Boot if Learn is visible on first load
document.addEventListener("DOMContentLoaded", () => {
  const learn = document.getElementById("learn");
  if (learn && !learn.classList.contains("hidden")) initLearnSection();
});

// --- Learn data seed
const learnData = {
  vocab: [
    { en: "Apple", fr: "la pomme" },
    { en: "Bread", fr: "le pain" },
    { en: "Water", fr: "l'eau" },
    { en: "Coffee", fr: "le café" },
    { en: "Tea", fr: "le thé" },
  ],
  grammar: [
    {
      title: "Basic Sentences",
      tipHtml: "<strong>Je suis</strong> = “I am”",
      examples: [
        "Je suis américain — I am American",
        "Je suis fatigué — I am tired",
      ],
    },
    {
      title: "Politeness",
      tipHtml: "<strong>S’il vous plaît</strong> = “please”",
      examples: ["Un café, s’il vous plaît — A coffee, please"],
    },
  ],
  pronunciation: ["Bonjour", "Bonsoir", "Merci", "S’il vous plaît", "Pardon"],
};

// --- Speech (safe)
function speak(text) {
  try {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "fr-FR";
    window.speechSynthesis.cancel(); // stop any current speech
    window.speechSynthesis.speak(msg);
  } catch (e) {
    console.warn("Speech not available:", e);
  }
}

// --- Simple store for progress
const LS = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  },
};

// --- Tiny helper
const el = (html) => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

function initLearnSection() {
  const root = document.getElementById("learn");
  if (!root) return;

  // Ensure a container exists
  let container = root.querySelector("#learn-container");
  if (!container) {
    container = el('<div id="learn-container" class="space-y-4"></div>');
    root.innerHTML = `
      <h2 class="text-2xl font-bold mb-2 text-center">📘 Learn French</h2>
      <p class="text-gray-600 text-sm mb-4 text-center">
        Quick lessons in vocabulary, grammar, and pronunciation.
      </p>
    `;
    root.appendChild(container);
  }

  // Render fresh each time
  container.innerHTML = "";
  container.appendChild(renderVocabCard());
  container.appendChild(renderGrammarCard());
  container.appendChild(renderPronunciationCard());

  // Wire events once (delegated)
  wireLearnEvents(container);
}

function renderVocabCard() {
  const learned = new Set(LS.get("learn:vocabLearned", []));
  const items = learnData.vocab
    .map(({ en, fr }) => {
      const key = `${en}|${fr}`;
      const checked = learned.has(key) ? "checked" : "";
      return `
      <li class="flex items-center justify-between py-1">
        <div class="text-gray-700">
          <span class="font-medium">${en}</span> — <span class="italic">${fr}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-2 py-1 rounded bg-blue-500 text-white text-xs" data-say="${fr}">
            ▶︎
          </button>
          <label class="text-xs flex items-center gap-1">
            <input type="checkbox" data-learn-key="${key}" ${checked} />
            learned
          </label>
        </div>
      </li>
    `;
    })
    .join("");

  return el(`
    <div class="bg-white rounded-2xl shadow p-4">
      <h3 class="text-lg font-semibold mb-2">🍎 Vocabulary</h3>
      <ul class="space-y-1">${items}</ul>
      <div class="mt-3 text-xs text-gray-500" id="vocab-progress"></div>
    </div>
  `);
}

function renderGrammarCard() {
  const g = learnData.grammar[0]; // quick pick (could randomize)
  const examples = g.examples
    .map((ex) => `<li class="text-gray-700">${ex}</li>`)
    .join("");
  return el(`
    <div class="bg-white rounded-2xl shadow p-4">
      <h3 class="text-lg font-semibold mb-2">🔤 Grammar: ${g.title}</h3>
      <p class="text-gray-700 mb-2">${g.tipHtml}</p>
      <ul class="space-y-1 list-disc pl-5">${examples}</ul>
      <button class="mt-3 px-3 py-1 rounded bg-gray-900 text-white text-sm" data-next-grammar>
        Next tip
      </button>
    </div>
  `);
}

function renderPronunciationCard() {
  const chips = learnData.pronunciation
    .map(
      (w) => `
    <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" data-say="${w}">
      ${w}
    </button>
  `
    )
    .join(" ");

  return el(`
    <div class="bg-white rounded-2xl shadow p-4">
      <h3 class="text-lg font-semibold mb-2">🎧 Pronunciation</h3>
      <p class="text-gray-700 mb-3">Tap to hear:</p>
      <div class="flex flex-wrap gap-2">${chips}</div>
    </div>
  `);
}

function wireLearnEvents(container) {
  // Speak buttons
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-say]");
    if (btn) speak(btn.getAttribute("data-say"));
  });

  // Mark vocab learned
  container.addEventListener("change", (e) => {
    const cb = e.target.closest('input[type="checkbox"][data-learn-key]');
    if (!cb) return;

    const key = cb.getAttribute("data-learn-key");
    const set = new Set(LS.get("learn:vocabLearned", []));
    cb.checked ? set.add(key) : set.delete(key);
    LS.set("learn:vocabLearned", [...set]);

    updateVocabProgress(container, set);
  });

  // Next grammar tip
  container.addEventListener("click", (e) => {
    if (!e.target.matches("[data-next-grammar]")) return;
    // rotate grammar tips
    const first = learnData.grammar.shift();
    learnData.grammar.push(first);
    // re-render grammar card only
    const cards = container.querySelectorAll(".bg-white");
    if (cards[1]) cards[1].replaceWith(renderGrammarCard());
  });

  // Initial progress
  updateVocabProgress(container, new Set(LS.get("learn:vocabLearned", [])));
}

function updateVocabProgress(container, learnedSet) {
  const total = learnData.vocab.length;
  const learned = learnedSet.size;
  const elProg = container.querySelector("#vocab-progress");
  if (elProg)
    elProg.textContent = `Progress: ${learned}/${total} words learned`;
}


document.addEventListener('DOMContentLoaded', () => {
  // if Learn is visible by default
  const learn = document.getElementById('learn');
  if (learn && !learn.classList.contains('hidden')) initLearnSection();

  // restore last tab
  let last = null;
  try { last = JSON.parse(localStorage.getItem('app:lastTab')); } catch {}
  if (last) {
    const target = document.getElementById(last);
    if (target) {
      document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hidden'));
      target.classList.remove('hidden');
      if (last === 'learn') initLearnSection();
    }
  }
});

