const SAMPLE_WORKOUT_PLAN = {
  "plan_name": "Elite Performance Weekly",
  "weekly_summary": {
    "total_days": 7,
    "rest_days": 1,
    "focus": "Strength & Hypertrophy"
  },
  "days": [
    {
      "day": "Day 01",
      "type": "Strength",
      "title": "Upper Body Power",
      "duration_min": 70,
      "intensity": "High",
      "calories_est": 350,
      "exercises": [
        {
          "name": "Barbell Bench Press",
          "sets": 4,
          "reps": "6-8"
        },
        {
          "name": "Weighted Pull-ups",
          "sets": 4,
          "reps": "6-10"
        },
        {
          "name": "Overhead Press",
          "sets": 4,
          "reps": "6-10"
        },
        {
          "name": "Barbell Rows",
          "sets": 3,
          "reps": "8-12"
        },
        {
          "name": "Dumbbell Curls",
          "sets": 3,
          "reps": "10-12"
        },
        {
          "name": "Tricep Dips",
          "sets": 3,
          "reps": "10-12"
        }
      ],
      "tip": "Focus on controlled eccentric motion (3-4 seconds) to maximize muscle tension and growth stimulus."
    },
    {
      "day": "Day 02",
      "type": "HIIT",
      "title": "Metabolic Blast",
      "duration_min": 45,
      "intensity": "Max",
      "calories_est": 420,
      "exercises": [
        {
          "name": "Burpees",
          "sets": 5,
          "reps": "30 sec"
        },
        {
          "name": "Mountain Climbers",
          "sets": 5,
          "reps": "30 sec"
        },
        {
          "name": "Jump Squats",
          "sets": 5,
          "reps": "30 sec"
        },
        {
          "name": "Box Jumps",
          "sets": 5,
          "reps": "30 sec"
        },
        {
          "name": "Battle Ropes",
          "sets": 5,
          "reps": "30 sec"
        }
      ],
      "tip": "Maintain high intensity with 30 seconds rest between exercises. Focus on explosive movements."
    },
    {
      "day": "Day 03",
      "type": "Strength",
      "title": "Lower Body Dominance",
      "duration_min": 65,
      "intensity": "High",
      "calories_est": 380,
      "exercises": [
        {
          "name": "Back Squats",
          "sets": 4,
          "reps": "6-8"
        },
        {
          "name": "Romanian Deadlifts",
          "sets": 4,
          "reps": "8-10"
        },
        {
          "name": "Bulgarian Split Squats",
          "sets": 3,
          "reps": "10-12 each"
        },
        {
          "name": "Leg Press",
          "sets": 3,
          "reps": "12-15"
        },
        {
          "name": "Calf Raises",
          "sets": 4,
          "reps": "15-20"
        },
        {
          "name": "Hamstring Curls",
          "sets": 3,
          "reps": "12-15"
        }
      ],
      "tip": "Prioritize depth and form on squats. Aim for parallel or below while maintaining neutral spine."
    },
    {
      "day": "Day 04",
      "type": "Cardio",
      "title": "Endurance Builder",
      "duration_min": 50,
      "intensity": "Medium",
      "calories_est": 400,
      "exercises": [
        {
          "name": "Treadmill Running",
          "sets": 1,
          "reps": "30 min"
        },
        {
          "name": "Rowing Machine",
          "sets": 1,
          "reps": "15 min"
        },
        {
          "name": "Cool Down Stretch",
          "sets": 1,
          "reps": "5 min"
        }
      ],
      "tip": "Maintain 65-75% of max heart rate for optimal fat burning and cardiovascular benefits."
    },
    {
      "day": "Day 05",
      "type": "Strength",
      "title": "Functional Integration",
      "duration_min": 55,
      "intensity": "Medium",
      "calories_est": 320,
      "exercises": [
        {
          "name": "Deadlifts",
          "sets": 4,
          "reps": "5-7"
        },
        {
          "name": "Clean and Press",
          "sets": 3,
          "reps": "6-8"
        },
        {
          "name": "Farmers Walk",
          "sets": 3,
          "reps": "40m"
        },
        {
          "name": "Kettlebell Swings",
          "sets": 3,
          "reps": "15-20"
        },
        {
          "name": "Turkish Get-ups",
          "sets": 3,
          "reps": "5 each side"
        }
      ],
      "tip": "Focus on compound movements that mimic real-world activities and engage multiple muscle groups."
    },
    {
      "day": "Day 06",
      "type": "HIIT",
      "title": "Athletic Conditioning",
      "duration_min": 40,
      "intensity": "High",
      "calories_est": 360,
      "exercises": [
        {
          "name": "Sprints",
          "sets": 8,
          "reps": "100m"
        },
        {
          "name": "Sled Push",
          "sets": 6,
          "reps": "20m"
        },
        {
          "name": "Plyometric Push-ups",
          "sets": 4,
          "reps": "10-12"
        },
        {
          "name": "Medicine Ball Slams",
          "sets": 4,
          "reps": "15"
        }
      ],
      "tip": "Allow 2-3 minutes between sprint sets for full recovery and maximum power output."
    },
    {
      "day": "Day 07",
      "type": "Active Recovery",
      "title": "Active Restoration",
      "duration_min": 45,
      "intensity": "Low",
      "calories_est": 180,
      "exercises": [
        {
          "name": "Yoga Flow",
          "sets": 1,
          "reps": "20 min"
        },
        {
          "name": "Foam Rolling",
          "sets": 1,
          "reps": "15 min"
        },
        {
          "name": "Light Swimming or Walking",
          "sets": 1,
          "reps": "10 min"
        }
      ],
      "tip": "Focus on mobility, breathing, and tissue recovery. This prepares your body for the upcoming training week."
    }
  ],
  "nutrition_tip": "Optimize your intake with 1.6-2.2g protein per kg of bodyweight and 15-22g carbs per kg for maximum strength gains. Precise fueling is key for performance.",
  "recovery_tip": "Prioritize 7-9 hours of quality sleep per night. Monitor heart rate variability (HRV) upon waking to gauge recovery status and adjust training intensity accordingly."
};

function useSampleData() {
  localStorage.setItem('workoutPlan', JSON.stringify(SAMPLE_WORKOUT_PLAN));
  window.location.href = 'Performance Metrics.html';
}
