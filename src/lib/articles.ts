export type Article = {
  id: string;
  title: string;
  excerpt: string;
  body: string[];
  category: 'Wellness' | 'Nutrition' | 'Mental Health' | 'Fitness' | 'Prevention';
  readTime: number;
  author: string;
  date: string;
  image: string;
};

export const articles: Article[] = [
  {
    id: 'sleep-foundation',
    title: 'The Science of Sleep: Building Your Foundation for Health',
    excerpt:
      'Why sleep is the single most underrated pillar of health — and a practical 5-step routine to sleep deeper tonight.',
    body: [
      'Sleep is not a luxury — it is the period when your body repairs tissue, consolidates memory, and rebalances the hormones that govern hunger, mood, and immunity. Chronic sleep deprivation is linked to higher risks of heart disease, obesity, diabetes, and depression.',
      'Most adults need 7–9 hours. The quality of those hours matters as much as the quantity: deep sleep restores the body, REM sleep restores the mind, and both follow predictable cycles of roughly 90 minutes.',
      'A simple, evidence-based routine: keep a consistent wake time, get morning sunlight within an hour of waking, avoid caffeine after 2pm, dim screens 90 minutes before bed, and keep the bedroom cool, dark, and quiet.',
      'If you lie awake for more than 20 minutes, leave the bed and do something calm in low light until you feel sleepy. This prevents your brain from associating the bed with frustration.',
    ],
    category: 'Wellness',
    readTime: 6,
    author: 'Dr. Lena Okoye',
    date: '2025-05-12',
    image:
      'https://images.pexels.com/photos/3049428/pexels-photo-3049428.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'mindful-plate',
    title: 'The Mindful Plate: A Simple Framework for Better Eating',
    excerpt:
      'No fads, no extremes — just a sustainable, science-backed way to think about every meal.',
    body: [
      'Nutrition does not have to be complicated. The "mindful plate" approach is a visual guide: fill half your plate with vegetables and fruit, a quarter with lean protein, and a quarter with whole grains, plus a small amount of healthy fat.',
      'Whole foods beat processed foods almost every time. The more a food is changed before it reaches you, the more it tends to deliver calories without the fiber, vitamins, and satiety signals your body relies on.',
      'Hydration is part of nutrition. Thirst is often mistaken for hunger; a glass of water before meals can help you tune in to real hunger cues.',
      'Sustainability matters more than perfection. A way of eating you can keep up for years will always beat a strict diet you abandon in a month.',
    ],
    category: 'Nutrition',
    readTime: 5,
    author: 'Dr. Marcus Reyes',
    date: '2025-04-28',
    image:
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'breath-anxiety',
    title: 'Three Breaths That Calm an Anxious Mind',
    excerpt:
      'When anxiety spikes, your breath is the fastest lever you have. Here are three techniques backed by physiology.',
    body: [
      'Anxiety lives in the body as much as the mind. When the fight-or-flight system activates, breathing becomes fast and shallow, which reinforces the feeling of panic. Slow, controlled breathing signals safety to the nervous system.',
      'Box breathing: inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat for four cycles. Used by first responders to stay steady under pressure.',
      '4-7-8 breathing: inhale for 4 seconds, hold for 7, exhale slowly for 8. Excellent before sleep or during a stress spike.',
      'Physiological sigh: two short inhales through the nose, then a long exhale through the mouth. Research shows it is the fastest way to lower acute stress in real time.',
      'These tools are powerful, but they are not a replacement for professional support. If anxiety is frequent or overwhelming, reach out — treatment works.',
    ],
    category: 'Mental Health',
    readTime: 4,
    author: 'Dr. Priya Nair',
    date: '2025-06-02',
    image:
      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'move-every-day',
    title: 'Move Every Day: A Realistic Guide to Staying Active',
    excerpt:
      'You do not need a gym membership or a marathon plan. Here is how to build movement that actually sticks.',
    body: [
      'The human body is built to move. Regular activity lowers the risk of heart disease, diabetes, and several cancers while improving mood, sleep, and cognition.',
      'The guideline is 150 minutes of moderate aerobic activity per week, plus two strength sessions. That can be walking, cycling, dancing, gardening — anything that raises your heart rate.',
      'The best exercise is the one you will actually do. Start small, schedule it like an appointment, and build identity around being "someone who moves."',
      'Strength training becomes especially important after 40. It preserves muscle and bone, supports metabolism, and protects independence as we age.',
    ],
    category: 'Fitness',
    readTime: 5,
    author: 'Dr. Aisha Bello',
    date: '2025-03-19',
    image:
      'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'preventive-checkups',
    title: 'Preventive Checkups: The Visits That Save Lives',
    excerpt:
      'Screenings and routine checkups catch problems early, when they are most treatable. Here is what to ask your doctor.',
    body: [
      'Preventive care is medicine at its best: finding risk before it becomes disease. Blood pressure, cholesterol, blood sugar, and cancer screenings are among the most impactful things you can do for long-term health.',
      'What to ask at a checkup: what screenings are recommended for my age and risk? What vaccines are due? Are my numbers in a healthy range, and what would improve them?',
      'Know your family history. It shapes which screenings matter most for you and when to start them.',
      'Do not wait for symptoms. Many serious conditions — hypertension, high cholesterol, early diabetes — are silent until they cause damage. A 30-minute visit can change the trajectory of your next 30 years.',
    ],
    category: 'Prevention',
    readTime: 6,
    author: 'Dr. Lena Okoye',
    date: '2025-02-08',
    image:
      'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'hydration-matters',
    title: 'Hydration: The Quiet Hero of Daily Health',
    excerpt:
      'Water affects energy, focus, skin, digestion, and even heart health. Here is how to get it right without overthinking it.',
    body: [
      'Every cell in your body depends on water. Even mild dehydration — as little as 1–2% of body weight — can reduce concentration, mood, and physical performance.',
      'A practical target is about 2–3 liters of fluids a day from all sources, more in heat or during exercise. Pale-yellow urine is a simple check.',
      'Start the day with a glass of water before coffee. Keep a refillable bottle visible. Flavor with cucumber or citrus if plain water feels boring.',
      'Older adults naturally lose the thirst signal and should drink on a schedule rather than waiting for thirst.',
    ],
    category: 'Nutrition',
    readTime: 4,
    author: 'Dr. Marcus Reyes',
    date: '2025-01-22',
    image:
      'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];
