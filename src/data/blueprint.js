const standardWarmup = [
  { name: "Arm Circles", sets: 1, reps: "20 fwd/bwd", muscle: "front-deltoids", isWarmup: true },
  { name: "Band Pull-Aparts", sets: 1, reps: "15", muscle: "back-deltoids", isWarmup: true },
  { name: "Scap Push-ups", sets: 1, reps: "10-15", muscle: "upper-back", isWarmup: true },
  { name: "Cat-Cow", sets: 1, reps: "10", muscle: "lower-back", isWarmup: true },
  { name: "World's Greatest Stretch", sets: 1, reps: "5/side", muscle: "quadriceps", isWarmup: true },
  { name: "Bear Crawl", sets: 1, reps: "30s", muscle: "abs", isWarmup: true },
  { name: "Inchworms", sets: 1, reps: "6", muscle: "hamstrings", isWarmup: true },
  { name: "Deadbugs/Planks", sets: 1, reps: "12/side", muscle: "abs", isWarmup: true },
  { name: "Explosive Jump/Push-ups", sets: 1, reps: "5", muscle: "chest", isWarmup: true },
  { name: "High-Knee Sprints", sets: 1, reps: "45s", muscle: "calves", isWarmup: true }
];

export const blueprint = {
  days: [
    {
      id: 1,
      name: "DAY 1: CHEST (LOWER SWEEP), SERRATUS, LOWER ABS & HIIT",
      type: "Metabolic/Chest/Shoulders",
      warmup: standardWarmup,
      exercises: [
        { name: "Decline DB Press", sets: 4, reps: "8-10", muscle: "Lower Chest" },
        { name: "Weighted Dips", sets: 4, reps: "8-10", muscle: "Lower Pec" },
        { name: "High-to-Low Cable Fly", sets: 3, reps: "12-15", muscle: "Nipple Area" },
        { name: "Dumbbell Pullovers", sets: 3, reps: "12", muscle: "Serratus" },
        { name: "Straight-Arm Pushdowns", sets: 3, reps: "15", muscle: "Lat/Armpit" },
        { name: "Deficit Push-Ups", sets: 2, reps: "Fail", muscle: "Burnout" },
        { name: "Hanging Leg Raises", sets: 4, reps: "12-15", muscle: "Lower Abs" },
        { name: "Decline Reverse Crunch", sets: 3, reps: "15-20", muscle: "Lower Abs" },
        { name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", muscle: "Full Core" },
        { name: "Treadmill HIIT", sets: 10, reps: "Rnds", muscle: "Fat Burn" }
      ],
      diet: {
        pre: "1 Black Coffee + 1 Banana + 5g Creatine",
        post: "1 Scoop Whey Isolate + 40g Oats (in water) + 1 tbsp Chia Seeds",
        lunch: "150g Paneer (air-fried) + 1 Roti + Massive Spinach/Cucumber Salad + Small bowl Dal",
        snack: "150g Low-fat Curd (Dahi) + 30g Roasted Chana + B12 Supplement",
        dinner: "70g Soya Chunks (sautéed w/ veg & 1 tsp oil) + Clear Broccoli/Mushroom Soup"
      }
    },
    {
      id: 2,
      name: "DAY 2: BACK (HUMP CORRECTION), BICEPS & DEEP CORE",
      type: "Posture/Back",
      warmup: standardWarmup,
      exercises: [
        { name: "Bent-Over Barbell Rows", sets: 4, reps: "8-10", muscle: "Mid-Back" },
        { name: "Wide-Grip Pulldowns", sets: 4, reps: "8-10", muscle: "Back Width" },
        { name: "Seated Cable Rows", sets: 3, reps: "10-12", muscle: "Rhomboids" },
        { name: "Heavy Cable Face Pulls", sets: 4, reps: "15", muscle: "Neck Posture" },
        { name: "Dumbbell Shrugs", sets: 3, reps: "12", muscle: "Upper Traps" },
        { name: "Incline DB Bicep Curls", sets: 3, reps: "10-12", muscle: "Bicep Peak" },
        { name: "Hammer Curls", sets: 3, reps: "10-12", muscle: "Arms" },
        { name: "Weighted Plank", sets: 3, reps: "60s", muscle: "Inner Core" },
        { name: "Weighted Deadbugs", sets: 4, reps: "12/s", muscle: "Anti-Ext." },
        { name: "Stairmaster/Incline", sets: 1, reps: "15 mins", muscle: "Steady Burn" }
      ],
      diet: {
        pre: "1 Black Coffee + 1 Apple + 5g Creatine",
        post: "1 Scoop Whey Isolate + 40g Oats + 1 tbsp Chia Seeds",
        lunch: "150g Firm Tofu (sautéed) + 50g Brown Rice + Cabbage/Tomato Salad + Small bowl Dal",
        snack: "150g Low-fat Curd + 30g Makhana (dry roasted) + B12 Supplement",
        dinner: "70g Soya Chunks + 1 Bowl Mixed Veg Soup + 1 whole Cucumber (lemon juice)"
      }
    },
    {
      id: 3,
      name: "DAY 3: LEGS, GLUTES & STEADY-STATE CARDIO",
      type: "Leg Day - Heavy Furnace",
      warmup: standardWarmup,
      exercises: [
        { name: "Barbell Back Squats", sets: 4, reps: "6-8", muscle: "Leg Mass" },
        { name: "Romanian Deadlifts", sets: 4, reps: "8-10", muscle: "Hamstrings" },
        { name: "Leg Press", sets: 3, reps: "10-12", muscle: "Quads" },
        { name: "Bulgarian Split Squats", sets: 3, reps: "10/leg", muscle: "Glutes" },
        { name: "Lying Hamstring Curls", sets: 3, reps: "12-15", muscle: "Hamstrings" },
        { name: "Leg Extensions", sets: 3, reps: "12-15", muscle: "Quads" },
        { name: "Dumbbell Lunges", sets: 3, reps: "12/leg", muscle: "Func. Legs" },
        { name: "Standing Calf Raises", sets: 4, reps: "15-20", muscle: "Calves" },
        { name: "Kettlebell Swings", sets: 3, reps: "15", muscle: "Power" },
        { name: "Rowing / Cycling", sets: 1, reps: "15 mins", muscle: "Flush" }
      ],
      diet: {
        pre: "1 Black Coffee + 1 Banana + 5g Creatine",
        post: "1 Scoop Whey Isolate + 40g Oats + 1 tbsp Chia Seeds",
        lunch: "150g Paneer (Bhurji style, zero oil) + 1 Roti + Massive Green Salad",
        snack: "150g Low-fat Curd + 30g Roasted Chana + B12 Supplement",
        dinner: "70g Soya Chunks in spinach puree (Palak Soya - zero cream) + 1 Bowl Clear Soup"
      }
    },
    {
      id: 4,
      name: "DAY 4: SHOULDERS, UPPER CHEST, LOWER ABS & HIIT",
      type: "Metabolic/Chest/Shoulders",
      warmup: standardWarmup,
      exercises: [
        { name: "Seated Overhead Press", sets: 4, reps: "8-10", muscle: "Delts" },
        { name: "Incline Barbell Bench", sets: 4, reps: "8-10", muscle: "Upper Chest" },
        { name: "Dumbbell Lateral Raise", sets: 4, reps: "12-15", muscle: "Side Delts" },
        { name: "1-Arm Cable Lat Raise", sets: 3, reps: "15/arm", muscle: "Side Delts" },
        { name: "Incline Dumbbell Flyes", sets: 3, reps: "12", muscle: "Pec Stretch" },
        { name: "Reverse Pec Deck", sets: 3, reps: "15", muscle: "Rear Delts" },
        { name: "Captain's Chair Tucks", sets: 4, reps: "15", muscle: "Lower Abs" },
        { name: "Decline Reverse Crunch", sets: 3, reps: "15-20", muscle: "Lower Abs" },
        { name: "High-to-Low Woodchops", sets: 3, reps: "15/s", muscle: "Obliques" },
        { name: "Assault Bike/Treadmill", sets: 10, reps: "Rnds", muscle: "Fat Burn" }
      ],
      diet: {
        pre: "1 Black Coffee + 1 Banana + 5g Creatine",
        post: "1 Scoop Whey Isolate + 40g Oats (in water) + 1 tbsp Chia Seeds",
        lunch: "150g Paneer (air-fried) + 1 Roti + Massive Spinach/Cucumber Salad + Small bowl Dal",
        snack: "150g Low-fat Curd (Dahi) + 30g Roasted Chana + B12 Supplement",
        dinner: "70g Soya Chunks (sautéed w/ veg & 1 tsp oil) + Clear Broccoli/Mushroom Soup"
      }
    },
    {
      id: 5,
      name: "DAY 5: BACK (LATS/WIDTH), ARMS & OBLIQUES",
      type: "Posture/Back",
      warmup: standardWarmup,
      exercises: [
        { name: "Wide Pull-Ups/Pulldown", sets: 4, reps: "8-10", muscle: "V-Taper" },
        { name: "Single-Arm DB Rows", sets: 4, reps: "10-12", muscle: "Mid/Low Lat" },
        { name: "Straight-Arm Pushdowns", sets: 3, reps: "12-15", muscle: "Armpit/Lat" },
        { name: "Tricep Rope Pushdowns", sets: 4, reps: "12-15", muscle: "Triceps" },
        { name: "Overhead Tricep Ext.", sets: 3, reps: "10-12", muscle: "Triceps" },
        { name: "EZ-Bar Preacher Curls", sets: 3, reps: "10-12", muscle: "Biceps" },
        { name: "Dumbbell Hammer Curls", sets: 3, reps: "10-12", muscle: "Forearms" },
        { name: "Low-to-High Woodchops", sets: 3, reps: "15/s", muscle: "Core Twist" },
        { name: "Weighted Russian Twist", sets: 4, reps: "20", muscle: "Handles" },
        { name: "Weighted Side Plank", sets: 3, reps: "45s/s", muscle: "Obliques" }
      ],
      diet: {
        pre: "1 Black Coffee + 1 Apple + 5g Creatine",
        post: "1 Scoop Whey Isolate + 40g Oats + 1 tbsp Chia Seeds",
        lunch: "150g Firm Tofu (sautéed) + 50g Brown Rice + Cabbage/Tomato Salad + Small bowl Dal",
        snack: "150g Low-fat Curd + 30g Makhana (dry roasted) + B12 Supplement",
        dinner: "70g Soya Chunks + 1 Bowl Mixed Veg Soup + 1 whole Cucumber (lemon juice)"
      }
    },
    {
      id: 6,
      name: "DAY 6: FUNCTIONAL FULL-BODY & POSTURE",
      type: "Full-Body Athletic",
      warmup: standardWarmup,
      exercises: [
        { name: "Dumbbell Thrusters", sets: 4, reps: "10-12", muscle: "Full Body" },
        { name: "Kettlebell Swings", sets: 4, reps: "15", muscle: "Post. Chain" },
        { name: "Dumbbell Walking Lunge", sets: 3, reps: "12/leg", muscle: "Legs" },
        { name: "Dumbbell Renegade Rows", sets: 3, reps: "8/side", muscle: "Core/Back" },
        { name: "Heavy Farmer's Carries", sets: 3, reps: "30-40m", muscle: "Traps/Core" },
        { name: "Heavy Cable Face Pulls", sets: 4, reps: "15", muscle: "Posture" },
        { name: "Prone Y-T-W Raises", sets: 3, reps: "10/pos", muscle: "Scapula" },
        { name: "Captain's Chair Tucks", sets: 3, reps: "15", muscle: "Lower Abs" },
        { name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", muscle: "Total Core" },
        { name: "Battle Ropes / Row", sets: 10, reps: "Rnds", muscle: "Cardio" }
      ],
      diet: {
        pre: "1 Black Coffee + 1 Apple + 5g Creatine",
        post: "1 Scoop Whey Isolate + 40g Oats + 1 tbsp Chia Seeds",
        lunch: "150g Firm Tofu + 50g Brown Rice + Cucumber/Lettuce Salad + Small bowl Dal",
        snack: "150g Low-fat Curd + 30g Makhana (dry roasted) + B12 Supplement",
        dinner: "70g Soya Chunks (protein chaat style w/ tomatoes/onions) + Clear Broccoli Soup"
      }
    },
    {
      id: 7,
      name: "DAY 7: ACTIVE REST DAY",
      type: "Rest",
      warmup: [],
      exercises: [],
      diet: {
        pre: "1 Scoop Whey Isolate + 30g Oats + 5g Creatine (No Fruit)",
        lunch: "150g Paneer (grilled) + Massive Green Salad (Skip Roti/Rice)",
        snack: "150g Low-fat Curd + 30g Roasted Chana + B12 Supplement",
        dinner: "70g Soya Chunks + Massive Steamed Veggies + 1 Bowl Clear Soup"
      }
    }
  ]
};
