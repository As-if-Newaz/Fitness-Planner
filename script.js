document.addEventListener('DOMContentLoaded', function() {
  // Handle gender button selection
  const genderButtons = document.querySelectorAll('.gender-btn');
  genderButtons.forEach(button => {
    button.addEventListener('click', function() {
      genderButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Handle experience tier selection
  const experienceCards = document.querySelectorAll('.select-card');
  experienceCards.forEach(card => {
    card.addEventListener('click', function() {
      experienceCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Handle objective selection (allow multiple selections)
  const objectiveCards = document.querySelectorAll('.objective-card');
  objectiveCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });

  // Handle weekly load selection
  const dayCards = document.querySelectorAll('.day-card');
  dayCards.forEach(card => {
    card.addEventListener('click', function() {
      dayCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      // Update the days counter
      const selectedDays = this.getAttribute('data-value');
      const daysNumber = document.querySelector('.days-number');
      if (daysNumber) {
        daysNumber.textContent = selectedDays.padStart(2, '0');
      }
    });
  });

  // Handle form submission
  const form = document.getElementById('fitnessForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      age: document.querySelector('input[name="age"]').value,
      weight: document.querySelector('input[name="weight"]').value,
      height: document.querySelector('input[name="height"]').value,
      gender: document.querySelector('.gender-btn.active')?.getAttribute('data-value'),
      experience: document.querySelector('.select-card.active')?.getAttribute('data-value'),
      objectives: Array.from(document.querySelectorAll('.objective-card.active'))
        .map(card => card.getAttribute('data-value')),
      weeklyLoad: document.querySelector('.day-card.active')?.getAttribute('data-value'),
      notes: document.querySelector('textarea[name="notes"]').value
    };
    
    console.log('Form Data:', formData);
    // Here you would typically send this data to your backend or AI service
    alert('Form submitted! Check console for data.');
  });
});
