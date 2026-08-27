const warmupDay1 = [
  { name: "Arm Circles (Forward & Backward)", sets: 1, reps: "20 per dir", muscle: "Shoulders", isWarmup: true },
  { name: "Dynamic Chest Hugs & Openers", sets: 1, reps: 15, muscle: "Chest", isWarmup: true },
  { name: "Cat-Cow to Thoracic Extension", sets: 1, reps: 12, muscle: "Spine", isWarmup: true },
  { name: "Scapular Push-ups", sets: 1, reps: 15, muscle: "Upper Back", isWarmup: true },
  { name: "World's Greatest Stretch (per side)", sets: 1, reps: 5, muscle: "Full Body", isWarmup: true },
  { name: "Plank with T-Spine Rotations (per side)", sets: 1, reps: 8, muscle: "Core", isWarmup: true },
  { name: "Deadbugs (per side)", sets: 1, reps: 12, muscle: "Core", isWarmup: true },
  { name: "Hollow Body Rocking", sets: 1, reps: 30, muscle: "Core", isWarmup: true },
  { name: "Explosive Clapping Push-ups", sets: 1, reps: 8, muscle: "Chest", isWarmup: true },
  { name: "High-Knee Sprints in Place (sec)", sets: 1, reps: 45, muscle: "Cardio", isWarmup: true }
];

const warmupDay2 = [
  { name: "Arm Circles (Small to Large)", sets: 1, reps: 20, muscle: "Shoulders", isWarmup: true },
  { name: "Band Pull-Aparts", sets: 1, reps: 15, muscle: "Upper Back", isWarmup: true },
  { name: "Cat-Cow with Deep Upper Back Arch", sets: 1, reps: 12, muscle: "Spine", isWarmup: true },
  { name: "Prone Y-T-W Raises (per pos)", sets: 1, reps: 10, muscle: "Shoulders", isWarmup: true },
  { name: "Thread the Needle (per side)", sets: 1, reps: 8, muscle: "Upper Back", isWarmup: true },
  { name: "World's Greatest Stretch (per side)", sets: 1, reps: 5, muscle: "Full Body", isWarmup: true },
  { name: "Bird-Dog with 2-Second Squeeze (per side)", sets: 1, reps: 10, muscle: "Core", isWarmup: true },
  { name: "Deadbugs (per side)", sets: 1, reps: 12, muscle: "Core", isWarmup: true },
  { name: "Banded Face Pulls to Overhead Press", sets: 1, reps: 12, muscle: "Shoulders", isWarmup: true },
  { name: "Explosive Jump Squats", sets: 1, reps: 10, muscle: "Legs", isWarmup: true }
];

const warmupDay3 = [
  { name: "Forward/Backward Leg Swings (per leg)", sets: 1, reps: 15, muscle: "Hips", targetMuscles: ["abductors", "gluteal"], isWarmup: true, steps: "Stand tall, hold a wall/rack for balance. Keep one leg planted and swing the other leg straight forward and backward like a pendulum.", mistake: "Arching your lower back aggressively when the leg swings back, or swaying your torso heavily. Movement must come from the hip joint." },
  { name: "Side-to-Side Leg Swings (per leg)", sets: 1, reps: 15, muscle: "Hips", targetMuscles: ["abductors", "adductor"], isWarmup: true, steps: "Face the wall/rack. Swing one leg across the front of your body, then swing it out to the side as high as comfortable.", mistake: "Twisting your hips and shoulders. Keep your torso squared to the wall." },
  { name: "Cat-Cow Mobility Flow", sets: 1, reps: 10, muscle: "Spine", targetMuscles: ["lower-back", "upper-back"], isWarmup: true, steps: "Get on all fours (hands under shoulders, knees under hips). Inhale and arch your back, dropping your belly (Cow). Exhale and round your spine toward the ceiling (Cat).", mistake: "Rushing the movement or cranking your neck aggressively to look up." },
  { name: "Deep Squat Pry with Elbow Push (rocks)", sets: 1, reps: 12, muscle: "Hips", targetMuscles: ["adductor", "gluteal"], isWarmup: true, steps: "Drop into the deepest squat you can manage. Place your elbows inside your knees and press them outward. Slowly rock side to side.", mistake: "Letting your heels lift off the ground or completely rounding your upper back into a slouch." },
  { name: "World's Greatest Stretch (per side)", sets: 1, reps: 5, muscle: "Full Body", targetMuscles: ["quadriceps", "gluteal", "hamstring", "chest"], isWarmup: true, steps: "Step into a deep lunge. Place both hands on the inside of your front foot. Drop your inside elbow toward the floor, then twist your torso and reach that same arm to the ceiling.", mistake: "Letting your back knee rest completely dead on the floor. Keep the back leg engaged." },
  { name: "Cossack Squats (per side)", sets: 1, reps: 6, muscle: "Legs", targetMuscles: ["adductor", "quadriceps", "gluteal"], isWarmup: true, steps: "Take an extra-wide stance. Shift your weight completely to one side, bending that knee while keeping the other leg completely straight (toes pointed up).", mistake: "Letting the heel of the bending leg come off the floor." },
  { name: "Single-Leg Glute Bridges (per leg)", sets: 1, reps: 12, muscle: "Glutes", targetMuscles: ["gluteal", "hamstring"], isWarmup: true, steps: "Lie on your back, knees bent. Lift one leg straight into the air. Drive through the heel of the planted foot to push your hips to the ceiling. Squeeze glutes.", mistake: "Arching your lower back to get your hips higher instead of using your glutes." },
  { name: "Deadbugs (per side)", sets: 1, reps: 12, muscle: "Core", targetMuscles: ["abs"], isWarmup: true, steps: "Lie on your back, arms reaching up, knees bent at 90 degrees in the air. Slowly lower your right arm and left leg toward the floor. Return and switch.", mistake: "Letting your lower back arch and lift off the floor. Your lower back must stay glued to the ground the entire time." },
  { name: "Pogo Jumps (Ankle Bounces)", sets: 1, reps: 30, muscle: "Calves", targetMuscles: ["calves"], isWarmup: true, steps: "Keep your knees almost completely stiff. Bounce up and down rapidly using only your calves and ankles (like a pogo stick).", mistake: "Bending the knees too much and turning it into a squat jump." },
  { name: "Downward Dog Calf Pumps (per leg)", sets: 1, reps: 10, muscle: "Calves", targetMuscles: ["calves", "hamstring"], isWarmup: true, steps: "Get into a Downward Dog yoga position (hips high in the air). Push your left heel flat into the floor while bending your right knee. Hold 2 seconds, then switch.", mistake: "Shifting all your body weight entirely onto your shoulders. Keep pushing your hips back." }
];

const warmupDay4 = [
  { name: "Overhead Band Dislocates", sets: 1, reps: 15, muscle: "Shoulders", isWarmup: true },
  { name: "Wall Slides with Forearm Lift", sets: 1, reps: 12, muscle: "Shoulders", isWarmup: true },
  { name: "Cat-Cow Mobility Flow", sets: 1, reps: 10, muscle: "Spine", isWarmup: true },
  { name: "Scapular Push-ups", sets: 1, reps: 15, muscle: "Upper Back", isWarmup: true },
  { name: "World's Greatest Stretch (per side)", sets: 1, reps: 5, muscle: "Full Body", isWarmup: true },
  { name: "Pike Push-up Rocks", sets: 1, reps: 10, muscle: "Shoulders", isWarmup: true },
  { name: "Deadbugs (per side)", sets: 1, reps: 12, muscle: "Core", isWarmup: true },
  { name: "Alternating V-Ups (total reps)", sets: 1, reps: 16, muscle: "Core", isWarmup: true },
  { name: "Plank to Push-up (Commandos)", sets: 1, reps: 12, muscle: "Chest/Core", isWarmup: true },
  { name: "Mountain Climbers (Sprint Pace) (total reps)", sets: 1, reps: 40, muscle: "Cardio", isWarmup: true }
];

const warmupDay5 = [
  { name: "Arm Circles (forward & backward)", sets: 1, reps: "20 per dir", muscle: "Shoulders", isWarmup: true },
  { name: "Straight-Arm Band Pulldowns", sets: 1, reps: 15, muscle: "Lats", isWarmup: true },
  { name: "Cat-Cow to Thoracic Extension", sets: 1, reps: 12, muscle: "Spine", isWarmup: true },
  { name: "Prone Y-T-W Raises (per pos)", sets: 1, reps: 10, muscle: "Shoulders", isWarmup: true },
  { name: "World's Greatest Stretch (per side)", sets: 1, reps: 5, muscle: "Full Body", isWarmup: true },
  { name: "Thread the Needle (per side)", sets: 1, reps: 8, muscle: "Upper Back", isWarmup: true },
  { name: "Bird-Dog with 2-Second Squeeze (per side)", sets: 1, reps: 10, muscle: "Core", isWarmup: true },
  { name: "Deadbugs (per side)", sets: 1, reps: 12, muscle: "Core", isWarmup: true },
  { name: "Side Plank with Arm Sweep (per side)", sets: 1, reps: 10, muscle: "Obliques", isWarmup: true },
  { name: "Fast Skipping Rope / Jumping Jacks (sec)", sets: 1, reps: 45, muscle: "Cardio", isWarmup: true }
];

const warmupDay6 = [
  { name: "Overhead Band Dislocates", sets: 1, reps: 15, muscle: "Shoulders", isWarmup: true },
  { name: "Wall Slides (Chin tucked back)", sets: 1, reps: 12, muscle: "Shoulders", isWarmup: true },
  { name: "Cat-Cow Mobility Flow", sets: 1, reps: 10, muscle: "Spine", isWarmup: true },
  { name: "Scapular Push-ups", sets: 1, reps: 15, muscle: "Upper Back", isWarmup: true },
  { name: "World's Greatest Stretch (per side)", sets: 1, reps: 5, muscle: "Full Body", isWarmup: true },
  { name: "Spiderman Lunges with Hip Dip (per side)", sets: 1, reps: 8, muscle: "Hips", isWarmup: true },
  { name: "Deadbugs (per side)", sets: 1, reps: 12, muscle: "Core", isWarmup: true },
  { name: "Neck Retractions (Chin Tucks)", sets: 1, reps: 15, muscle: "Neck", isWarmup: true },
  { name: "Lateral Skater Hops (total reps)", sets: 1, reps: 16, muscle: "Legs", isWarmup: true },
  { name: "Tuck Jumps", sets: 1, reps: 8, muscle: "Legs", isWarmup: true }
];

export const blueprint = {
  days: [
    {
      id: 1,
      name: "DAY 1: CHEST (LOWER SWEEP), SERRATUS, LOWER ABS & HIIT",
      type: "Metabolic/Chest/Shoulders",
      warmup: warmupDay1,
      exercises: [
        { name: "Decline DB Press", sets: 4, reps: 10, muscle: "Lower Chest" },
        { name: "Weighted Dips", sets: 4, reps: 10, muscle: "Lower Pec" },
        { name: "High-to-Low Cable Fly", sets: 3, reps: 15, muscle: "Nipple Area" },
        { name: "Dumbbell Pullovers", sets: 3, reps: 12, muscle: "Serratus" },
        { name: "Straight-Arm Pushdowns", sets: 3, reps: 15, muscle: "Lat/Armpit" },
        { name: "Deficit Push-Ups", sets: 2, reps: 20, muscle: "Burnout" },
        { name: "Hanging Leg Raises", sets: 4, reps: 15, muscle: "Lower Abs" },
        { name: "Decline Reverse Crunch", sets: 3, reps: 20, muscle: "Lower Abs" },
        { name: "Ab Wheel Rollouts", sets: 3, reps: 12, muscle: "Full Core" },
        { name: "Treadmill HIIT (intervals)", sets: 1, reps: 10, muscle: "Fat Burn" }
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
      warmup: warmupDay2,
      exercises: [
        { name: "Bent-Over Barbell Rows", sets: 4, reps: 10, muscle: "Mid-Back" },
        { name: "Wide-Grip Pulldowns", sets: 4, reps: 10, muscle: "Back Width" },
        { name: "Seated Cable Rows", sets: 3, reps: 12, muscle: "Rhomboids" },
        { name: "Heavy Cable Face Pulls", sets: 4, reps: 15, muscle: "Neck Posture" },
        { name: "Dumbbell Shrugs", sets: 3, reps: 12, muscle: "Upper Traps" },
        { name: "Incline DB Bicep Curls", sets: 3, reps: 12, muscle: "Bicep Peak" },
        { name: "Hammer Curls", sets: 3, reps: 12, muscle: "Arms" },
        { name: "Weighted Plank (sec)", sets: 3, reps: 60, muscle: "Inner Core" },
        { name: "Weighted Deadbugs (per side)", sets: 4, reps: 12, muscle: "Anti-Ext." },
        { name: "Stairmaster/Incline (mins)", sets: 1, reps: 15, muscle: "Steady Burn" }
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
      warmup: warmupDay3,
      exercises: [
        { name: "Barbell Back Squats", sets: 4, reps: 8, muscle: "Leg Mass", targetMuscles: ["quadriceps", "gluteal"], steps: "Rest the bar across your upper traps. Unrack and take two steps back. Keep chest tall, brace core. Break at the hips and knees simultaneously. Drop until your hip crease is below your knees (parallel). Drive through mid-foot to stand up.", mistake: "Knees caving inward (valgus collapse) on the way up, or turning the squat into a \"good morning\" by leaning your chest entirely toward the floor." },
        { name: "Romanian Deadlifts", sets: 4, reps: 10, muscle: "Hamstrings", targetMuscles: ["hamstring", "gluteal", "lower-back"], steps: "Hold barbell/dumbbells with a shoulder-width stance, knees slightly bent (soft knees). Push your hips as far back to the wall behind you as possible while sliding the weight down your legs. Once you feel a deep hamstring stretch, squeeze glutes to stand up.", mistake: "Rounding your upper and lower back, or bending your knees too much (which turns it into a traditional squat/deadlift rather than a hamstring stretch)." },
        { name: "Leg Press", sets: 3, reps: 12, muscle: "Quads", targetMuscles: ["quadriceps", "gluteal"], steps: "Place feet shoulder-width apart on the sled. Lower the sled under control as deep as you can without your lower back lifting off the seat pad. Press back up.", mistake: "Locking your knees out aggressively at the top (hyper-extending them), or bringing your knees so close to your chest that your tailbone rolls off the pad." },
        { name: "Bulgarian Split Squats (per leg)", sets: 3, reps: 10, muscle: "Glutes", targetMuscles: ["quadriceps", "gluteal"], steps: "Stand a few feet in front of a bench. Place one foot behind you on the bench. Drop your back knee straight down toward the floor until your front thigh is parallel. Push through the front heel to stand up.", mistake: "Placing your front foot perfectly in line with your back foot like you are on a tightrope (this destroys your balance). Keep your feet hip-width apart." },
        { name: "Lying Hamstring Curls", sets: 3, reps: 15, muscle: "Hamstrings", targetMuscles: ["hamstring", "calves"], steps: "Lie face down on the machine, ankle pad resting on your lower calves. Curl the pad up to your glutes, squeeze for 1 second, and lower it very slowly (take 3 seconds to lower it).", mistake: "Jerking your hips forcefully off the pad to create momentum using your lower back instead of your hamstrings." },
        { name: "Leg Extensions", sets: 3, reps: 15, muscle: "Quads", targetMuscles: ["quadriceps"], steps: "Sit firmly in the machine. Extend your legs until they are straight. Flex your quads hard at the top for 1 second, then lower the weight with control.", mistake: "Dropping the weight instantly without resisting the eccentric (downward) phase." },
        { name: "Dumbbell Lunges (per leg)", sets: 3, reps: 12, muscle: "Func. Legs", targetMuscles: ["quadriceps", "gluteal", "hamstring"], steps: "Hold dumbbells at your sides. Take a long step forward. Drop your back knee until it lightly hovers just above the floor. Push off the front foot to return to the starting position (or step through for walking lunges).", mistake: "Slamming your back knee into the floor, or taking a step so short that your front heel lifts off the ground and jams your knee." },
        { name: "Standing Calf Raises", sets: 4, reps: 20, muscle: "Calves", targetMuscles: ["calves"], steps: "Stand with the balls of your feet on the edge of a step/block. Lower your heels toward the floor to get a maximum stretch in the calf. Press all the way up onto your big toes.", mistake: "Bouncing up and down rapidly. Calves are mostly slow-twitch muscle fibers; you must pause at the bottom stretch and pause at the top squeeze for them to grow." },
        { name: "Kettlebell Swings", sets: 3, reps: 15, muscle: "Power", targetMuscles: ["hamstring", "gluteal", "lower-back"], steps: "Stand with feet slightly wider than shoulder-width. Hinge at the hips (push hips back), letting the kettlebell swing between your legs. Aggressively snap your hips forward and squeeze your glutes to launch the bell up to chest height.", mistake: "Squatting the weight and using your front shoulder muscles to lift the bell. This is a hip-hinge power movement, not a shoulder raise." },
        { name: "Rowing / Cycling (mins)", sets: 1, reps: 15, muscle: "Flush", targetMuscles: ["quadriceps", "hamstring", "calves", "gluteal", "back-deltoids"], steps: "Strap into the machine. Maintain a steady, moderate pace for 15 minutes. Focus on deep breathing and flushing the blood through your legs.", mistake: "Going too hard or sprinting. This is meant to be a steady-state flush to clear lactic acid from your heavy lifting, not an exhaustion test." }
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
      warmup: warmupDay4,
      exercises: [
        { name: "Seated Overhead Press", sets: 4, reps: 10, muscle: "Delts" },
        { name: "Incline Barbell Bench", sets: 4, reps: 10, muscle: "Upper Chest" },
        { name: "Dumbbell Lateral Raise", sets: 4, reps: 15, muscle: "Side Delts" },
        { name: "1-Arm Cable Lat Raise (per arm)", sets: 3, reps: 15, muscle: "Side Delts" },
        { name: "Incline Dumbbell Flyes", sets: 3, reps: 12, muscle: "Pec Stretch" },
        { name: "Reverse Pec Deck", sets: 3, reps: 15, muscle: "Rear Delts" },
        { name: "Captain's Chair Tucks", sets: 4, reps: 15, muscle: "Lower Abs" },
        { name: "Decline Reverse Crunch", sets: 3, reps: 20, muscle: "Lower Abs" },
        { name: "High-to-Low Woodchops (per side)", sets: 3, reps: 15, muscle: "Obliques" },
        { name: "Assault Bike/Treadmill (intervals)", sets: 1, reps: 10, muscle: "Fat Burn" }
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
      warmup: warmupDay5,
      exercises: [
        { name: "Wide Pull-Ups/Pulldown", sets: 4, reps: 10, muscle: "V-Taper" },
        { name: "Single-Arm DB Rows", sets: 4, reps: 12, muscle: "Mid/Low Lat" },
        { name: "Straight-Arm Pushdowns", sets: 3, reps: 15, muscle: "Armpit/Lat" },
        { name: "Tricep Rope Pushdowns", sets: 4, reps: 15, muscle: "Triceps" },
        { name: "Overhead Tricep Ext.", sets: 3, reps: 12, muscle: "Triceps" },
        { name: "EZ-Bar Preacher Curls", sets: 3, reps: 12, muscle: "Biceps" },
        { name: "Dumbbell Hammer Curls", sets: 3, reps: 12, muscle: "Forearms" },
        { name: "Low-to-High Woodchops (per side)", sets: 3, reps: 15, muscle: "Core Twist" },
        { name: "Weighted Russian Twist", sets: 4, reps: 20, muscle: "Handles" },
        { name: "Weighted Side Plank (sec/side)", sets: 3, reps: 45, muscle: "Obliques" }
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
      warmup: warmupDay6,
      exercises: [
        { name: "Dumbbell Thrusters", sets: 4, reps: 12, muscle: "Full Body" },
        { name: "Kettlebell Swings", sets: 4, reps: 15, muscle: "Post. Chain" },
        { name: "Dumbbell Walking Lunge (per leg)", sets: 3, reps: 12, muscle: "Legs" },
        { name: "Dumbbell Renegade Rows (per side)", sets: 3, reps: 8, muscle: "Core/Back" },
        { name: "Heavy Farmer's Carries (meters)", sets: 3, reps: 40, muscle: "Traps/Core" },
        { name: "Heavy Cable Face Pulls", sets: 4, reps: 15, muscle: "Posture" },
        { name: "Prone Y-T-W Raises (per pos)", sets: 3, reps: 10, muscle: "Scapula" },
        { name: "Captain's Chair Tucks", sets: 3, reps: 15, muscle: "Lower Abs" },
        { name: "Ab Wheel Rollouts", sets: 3, reps: 12, muscle: "Total Core" },
        { name: "Battle Ropes / Row (intervals)", sets: 1, reps: 10, muscle: "Cardio" }
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
