document.addEventListener('DOMContentLoaded', function() {
  
  const pathname = window.location.pathname;
  const pageTitle = document.title;
  const isMetricsPage = (pathname.includes('Performance') && pathname.includes('Metrics')) || 
                        pageTitle.includes('Performance Metrics');
  
  if (isMetricsPage) {
    initializeMetricsPage();
  } else {
    initializePlanBuilder();
  }
});

function initializePlanBuilder() {
  const genderButtons = document.querySelectorAll('.gender-btn');
  genderButtons.forEach(button => {
    button.addEventListener('click', function() {
      genderButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const experienceCards = document.querySelectorAll('.select-card');
  experienceCards.forEach(card => {
    card.addEventListener('click', function() {
      experienceCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const objectiveCards = document.querySelectorAll('.objective-card');
  objectiveCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });

  const dayCards = document.querySelectorAll('.day-card');
  dayCards.forEach(card => {
    card.addEventListener('click', function() {
      dayCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      const selectedDays = this.getAttribute('data-value');
      const daysNumber = document.querySelector('.days-number');
      if (daysNumber) {
        daysNumber.textContent = selectedDays.padStart(2, '0');
      }
    });
  });

  const form = document.getElementById('fitnessForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function validateForm(formData) {
  const errors = [];
  
  if (!formData.age || formData.age < 1 || formData.age > 120) {
    errors.push('Please enter a valid age');
  }
  
  if (!formData.weight || formData.weight < 1) {
    errors.push('Please enter a valid weight');
  }
  
  if (!formData.height || formData.height < 1) {
    errors.push('Please enter a valid height');
  }
  
  if (!formData.gender) {
    errors.push('Please select a gender');
  }
  
  if (!formData.experience) {
    errors.push('Please select an experience level');
  }
  
  if (!formData.objectives || formData.objectives.length === 0) {
    errors.push('Please select at least one objective');
  }
  
  if (!formData.weeklyLoad) {
    errors.push('Please select weekly training days');
  }
  
  return errors;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = {
    age: document.querySelector('input[name="age"]').value,
    weight: document.querySelector('input[name="weight"]').value,
    height: document.querySelector('input[name="height"]').value,
    gender: document.querySelector('.gender-btn.active')?.getAttribute('data-value'),
    experience: document.querySelector('.select-card.active')?.getAttribute('data-value'),
    objectives: Array.from(document.querySelectorAll('.objective-card.active'))
      .map(card => card.getAttribute('data-value')),
    weeklyLoad: parseInt(document.querySelector('.day-card.active')?.getAttribute('data-value')),
    notes: document.querySelector('textarea[name="notes"]').value
  };
  
  const errors = validateForm(formData);
  if (errors.length > 0) {
    showError(errors.join('\n'));
    return;
  }
  
  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.disabled = true;
  showLoading();
  
  try {
    const workoutPlan = await generateWorkoutPlan(formData);
    
    localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
    
    window.location.href = 'Performance Metrics.html';
    
  } catch (error) {
    console.error('Error generating plan:', error);
    hideLoading();
    submitBtn.disabled = false;
    
    let errorMessage = 'Failed to generate workout plan. Please try again.';
    if (error.message.includes('API request failed')) {
      errorMessage = 'Unable to connect to the AI service. Please check your connection and try again.';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Received invalid response from AI. Please try again.';
    }
    
    showError(errorMessage);
  }
}

async function generateWorkoutPlan(formData) {
  const systemPrompt = `You are a professional fitness trainer AI. Generate a personalized weekly workout plan based on user data.

CRITICAL: You MUST respond with ONLY valid JSON, no markdown formatting, no backticks, no explanations.

The JSON must follow this exact schema:
{
  "plan_name": "string",
  "weekly_summary": { "total_days": number, "rest_days": number, "focus": "string" },
  "days": [
    {
      "day": "Day 01" | "Day 02" | etc,
      "type": "Strength" | "Cardio" | "HIIT" | "Yoga" | "Rest" | "Active Recovery" | "Flexibility",
      "title": "string",
      "duration_min": number,
      "intensity": "Low" | "Medium" | "High" | "Max",
      "calories_est": number,
      "exercises": [{ "name": "string", "sets": number|null, "reps": "string"|null }],
      "tip": "string"
    }
  ],
  "nutrition_tip": "string",
  "recovery_tip": "string"
}`;

  const userPrompt = `Generate a ${formData.weeklyLoad}-day personalized workout plan for:
- Age: ${formData.age}
- Weight: ${formData.weight}kg
- Height: ${formData.height}cm
- Gender: ${formData.gender}
- Experience: ${formData.experience}
- Goals: ${formData.objectives.join(', ')}
${formData.notes ? `- Additional notes: ${formData.notes}` : ''}

Create a balanced weekly plan with ${formData.weeklyLoad} active days. Include variety in workout types, appropriate intensity, and specific exercises with sets/reps.`;

  const response = await fetch(CONFIG.OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href,
      'X-Title': 'AI Fitness Planner'
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;
  
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const plan = JSON.parse(content);
  return plan;
}

function initializeMetricsPage() {
  const planData = localStorage.getItem('workoutPlan');
  
  if (!planData) {
    showError('No workout plan found. Please generate a plan first.');
    setTimeout(() => {
      window.location.href = 'Plan Builder.html';
    }, 2000);
    return;
  }
  
  try {
    const plan = JSON.parse(planData);
    renderWorkoutPlan(plan);
    initializeWorkoutToggle();
  } catch (error) {
    showError('Failed to load workout plan. Please try again.');
  }
}

function renderWorkoutPlan(plan) {
  
  try {
    const titleElement = document.querySelector('.performance-title');
    if (titleElement) {
      titleElement.textContent = plan.plan_name || 'YOUR WEEKLY PLAN';
    }
    
    const metricsGrid = document.querySelector('.metrics-grid');
    if (metricsGrid && plan.weekly_summary) {
      const summary = plan.weekly_summary;
      
      const totalCalories = plan.days && Array.isArray(plan.days)
        ? plan.days.reduce((sum, day) => sum + (day.calories_est || 0), 0)
        : 0;
      
      metricsGrid.innerHTML = `
        <div class="metric-card">
          <div class="metric-icon"><i class="fas fa-calendar-check"></i></div>
          <div class="metric-value">${summary.total_days}</div>
          <div class="metric-label">ACTIVE DAYS</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon"><i class="fas fa-bed"></i></div>
          <div class="metric-value">${summary.rest_days}</div>
          <div class="metric-label">REST DAYS</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon"><i class="fas fa-fire"></i></div>
          <div class="metric-value">${totalCalories}</div>
          <div class="metric-label">KCAL / WK</div>
        </div>
      `;
    }
    
    const tipsContainer = document.querySelector('.tips-container');
    if (tipsContainer) {
      tipsContainer.innerHTML = `
        <div class="tip-card">
          <div class="tip-icon"><i class="fas fa-utensils"></i></div>
          <div class="tip-text">${plan.nutrition_tip || 'Stay hydrated and eat balanced meals.'}</div>
        </div>
        <div class="tip-card">
          <div class="tip-icon"><i class="fas fa-spa"></i></div>
          <div class="tip-text">${plan.recovery_tip || 'Get adequate rest and sleep.'}</div>
        </div>
      `;
    }
    
    const container = document.querySelector('.container');
    if (container && plan.days && Array.isArray(plan.days)) {
      document.querySelectorAll('.workout-day-card').forEach(card => card.remove());
      
      plan.days.forEach((day, index) => {
        const workoutCard = createWorkoutCard(day, index);
        container.appendChild(workoutCard);
      });
    }
  } catch (error) {
    showError('Failed to render workout plan.');
  }
}

function createWorkoutCard(day, index) {
  const card = document.createElement('div');
  card.className = 'workout-day-card collapsed';
  card.dataset.index = index;
  
  const typeIcons = {
    'Strength': 'fa-dumbbell',
    'Cardio': 'fa-running',
    'HIIT': 'fa-fire',
    'Yoga': 'fa-spa',
    'Rest': 'fa-bed',
    'Active Recovery': 'fa-leaf',
    'Flexibility': 'fa-hands'
  };
  
  const icon = typeIcons[day.type] || 'fa-dumbbell';
  
  const exercises = Array.isArray(day.exercises) ? day.exercises : [];
  
  card.innerHTML = `
    <div class="workout-day-header">
      <div class="workout-day-badge">
        <i class="fas ${icon}"></i>
      </div>
      <div class="workout-day-info">
        <div class="workout-day-number">${(day.day || 'Day ' + (index + 1)).toUpperCase()}</div>
        <div class="workout-day-tier">${(day.type || 'Workout').toUpperCase()}</div>
        <h2 class="workout-day-title">${day.title || 'Workout'}</h2>
      </div>
      <div class="workout-duration">${day.duration_min || 0} <span>MIN</span></div>
      <button class="workout-toggle-btn">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    <div class="workout-day-content">
      <div class="workout-stats">
        <div class="workout-stat">
          <div class="workout-stat-icon"><i class="fas fa-clock"></i></div>
          <div class="workout-stat-value">${day.duration_min || 0}</div>
          <div class="workout-stat-label">MINUTES</div>
        </div>
        <div class="workout-stat">
          <div class="workout-stat-icon"><i class="fas fa-fire"></i></div>
          <div class="workout-stat-value">${day.calories_est || 0}</div>
          <div class="workout-stat-label">CALORIES</div>
        </div>
        <div class="workout-stat">
          <div class="workout-stat-icon"><i class="fas fa-list"></i></div>
          <div class="workout-stat-value">${exercises.length}</div>
          <div class="workout-stat-label">EXERCISES</div>
        </div>
        <div class="workout-stat">
          <div class="workout-stat-icon"><i class="fas fa-bolt"></i></div>
          <div class="workout-stat-value">${day.intensity || 'Medium'}</div>
          <div class="workout-stat-label">INTENSITY</div>
        </div>
      </div>
      <div class="exercise-list">
        ${exercises.map(ex => `
          <div class="exercise-item">
            <div class="exercise-icon"><i class="fas fa-dumbbell"></i></div>
            <div class="exercise-name">${ex.name || 'Exercise'}</div>
            <div class="exercise-sets">${ex.sets && ex.reps ? `${ex.sets} SETS × ${ex.reps} REPS` : 'As prescribed'}</div>
          </div>
        `).join('')}
      </div>
      ${day.tip ? `
        <div class="workout-recommendation">
          <div class="recommendation-icon"><i class="fas fa-lightbulb"></i></div>
          <div class="recommendation-text">${day.tip}</div>
        </div>
      ` : ''}
    </div>
  `;
  
  return card;
}

function initializeWorkoutToggle() {
  const cards = document.querySelectorAll('.workout-day-card');
  
  cards.forEach(card => {
    const toggleBtn = card.querySelector('.workout-toggle-btn');
    const header = card.querySelector('.workout-day-header');
    
    if (!toggleBtn || !header) {
      return;
    }
    
    const toggle = () => {
      const isCollapsed = card.classList.contains('collapsed');
      
      if (isCollapsed) {
        card.classList.remove('collapsed');
        card.classList.add('expanded');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-chevron-up';
      } else {
        card.classList.add('collapsed');
        card.classList.remove('expanded');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-chevron-down';
      }
    };
    
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
    
    header.addEventListener('click', toggle);
  });
}

function showLoading() {
  const existing = document.querySelector('.loading-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.className = 'loading-modal';
  modal.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <div class="loading-text">Generating Your Plan</div>
      <div class="loading-subtext">This may take a few moments...</div>
    </div>
  `;
  document.body.appendChild(modal);
}

function hideLoading() {
  const modal = document.querySelector('.loading-modal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  }
}

function showError(message) {
  const existing = document.querySelector('.error-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.className = 'error-modal';
  modal.innerHTML = `
    <div class="error-content">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="error-title">Oops!</div>
      <div class="error-message">${message}</div>
      <button class="error-btn" onclick="this.closest('.error-modal').remove()">
        OK
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
