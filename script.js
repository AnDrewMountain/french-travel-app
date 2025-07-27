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