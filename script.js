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
    const amount = parseFloat(amountInput.value);//converts string into a number
    const from = fromCurrency.value;//Gets the selected value from first dropdown
    const to = toCurrency.value;//Grabs the value from the second dropdown
})