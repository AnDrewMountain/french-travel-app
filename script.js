const buttons= document.querySelectorAll('.tab-btn');
const sections= document.querySelectorAll('.tab-section');

buttons.forEach(btn =>{
    btn.addEventListener('click', ()=>{
        const target = btn.dataset.tab;
        sections.forEach(section =>{
            section.classList.toggle('hidden', section.id !== target);
        });
    });
});