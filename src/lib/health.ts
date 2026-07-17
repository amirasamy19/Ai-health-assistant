// Lightweight rule-based health knowledge base used to power the
// in-app AI symptom checker and chat assistant. This is NOT a medical
// device — responses always include a disclaimer to seek professional care.

export type SymptomRule = {
  keywords: string[];
  analysis: string;
  urgency: 'low' | 'moderate' | 'high';
  recommendations: string[];
};

export const symptomRules: SymptomRule[] = [
  {
    keywords: ['fever', 'temperature', 'chills', 'hot'],
    analysis:
      'Your symptoms are consistent with a fever, most commonly caused by a viral or bacterial infection. Monitor your temperature and stay hydrated.',
    urgency: 'moderate',
    recommendations: [
      'Rest and drink plenty of fluids (water, clear broths, oral rehydration solutions).',
      'Keep the room comfortably cool and wear lightweight clothing.',
      'Consider over-the-counter antipyretics (paracetamol/ibuprofen) as directed.',
      'Seek care if fever exceeds 39.4°C (103°F), lasts more than 3 days, or is accompanied by difficulty breathing, stiff neck, or confusion.',
    ],
  },
  {
    keywords: ['headache', 'migraine', 'head pain', 'head ache'],
    analysis:
      'Headaches have many causes — tension, dehydration, eye strain, or migraine. Most are benign and self-limiting.',
    urgency: 'low',
    recommendations: [
      'Hydrate and rest in a quiet, dimly lit room.',
      'Apply a cool compress to the forehead or neck.',
      'Note potential triggers (stress, screen time, skipped meals, caffeine).',
      'Seek urgent care for a sudden severe "thunderclap" headache, headache with fever/stiff neck, or after a head injury.',
    ],
  },
  {
    keywords: ['cough', 'sore throat', 'congestion', 'runny nose', 'sneezing', 'cold'],
    analysis:
      'These are classic upper-respiratory symptoms, usually viral (common cold). They typically resolve within 7–10 days.',
    urgency: 'low',
    recommendations: [
      'Rest, hydrate, and use saline nasal spray or lozenges for comfort.',
      'Use a humidifier and avoid irritants like smoke.',
      'Seek care if symptoms last beyond 10 days, you develop high fever, shortness of breath, or cough up blood.',
    ],
  },
  {
    keywords: ['chest pain', 'shortness of breath', 'breathing difficulty', 'palpitation', 'tight chest'],
    analysis:
      'Chest pain or breathing difficulty can be serious and should not be ignored. It may indicate cardiac, pulmonary, or other urgent causes.',
    urgency: 'high',
    recommendations: [
      'If pain is severe, radiating to the arm/jaw, with sweating or fainting — call emergency services immediately.',
      'Stop physical activity and sit upright.',
      'Do not drive yourself; have someone take you to the emergency department.',
      'Even mild but persistent chest symptoms warrant a prompt professional evaluation.',
    ],
  },
  {
    keywords: ['stomach', 'nausea', 'vomit', 'diarrhea', 'abdominal', 'cramp', 'bloating'],
    analysis:
      'Gastrointestinal symptoms are often caused by infection, food intolerance, or indigestion. Most resolve within a few days.',
    urgency: 'moderate',
    recommendations: [
      'Stay hydrated with small sips of fluids and oral rehydration solutions.',
      'Eat bland foods (rice, toast, bananas) and avoid dairy, caffeine, and fatty foods.',
      'Seek care if there is blood in vomit/stool, severe pain, high fever, or signs of dehydration.',
    ],
  },
  {
    keywords: ['rash', 'itch', 'skin', 'hives', 'redness'],
    analysis:
      'Skin rashes have many causes — allergy, infection, contact dermatitis, or heat. Most are mild and self-limiting.',
    urgency: 'low',
    recommendations: [
      'Avoid scratching and known triggers (new soaps, fabrics, foods).',
      'Apply a cool compress and consider an oral antihistamine.',
      'Seek care if the rash spreads rapidly, blisters, is painful, or is accompanied by fever or swelling of the face/throat.',
    ],
  },
  {
    keywords: ['fatigue', 'tired', 'exhausted', 'low energy', 'sleepy'],
    analysis:
      'Fatigue is common and often linked to sleep, stress, nutrition, or dehydration. Persistent fatigue deserves attention.',
    urgency: 'low',
    recommendations: [
      'Aim for 7–9 hours of sleep and a consistent schedule.',
      'Balance meals, hydrate, and limit caffeine late in the day.',
      'If fatigue lasts more than 2 weeks, see a clinician to check for anemia, thyroid, or other causes.',
    ],
  },
  {
    keywords: ['dizzy', 'dizziness', 'lightheaded', 'faint', 'vertigo'],
    analysis:
      'Dizziness can result from dehydration, low blood sugar, inner-ear issues, or blood pressure changes.',
    urgency: 'moderate',
    recommendations: [
      'Sit or lie down immediately and hydrate.',
      'Rise slowly from sitting or lying positions.',
      'Seek urgent care if dizziness is accompanied by chest pain, severe headache, weakness, slurred speech, or fainting.',
    ],
  },
  {
    keywords: ['back pain', 'back ache', 'spine', 'lower back'],
    analysis:
      'Most back pain is musculoskeletal and improves with gentle movement and time.',
    urgency: 'low',
    recommendations: [
      'Stay gently active; avoid prolonged bed rest.',
      'Apply heat or cold to the affected area.',
      'Seek care if you have numbness/weakness in the legs, loss of bladder/bowel control, or pain after a fall.',
    ],
  },
  {
    keywords: ['anxiety', 'stress', 'panic', 'worried', 'depressed', 'sad', 'mood'],
    analysis:
      'Emotional and mental health are as important as physical health. Stress and anxiety are very common and treatable.',
    urgency: 'moderate',
    recommendations: [
      'Practice slow breathing, grounding, or mindfulness exercises.',
      'Maintain sleep, movement, and social connection.',
      'If feelings persist or overwhelm you, reach out to a mental-health professional or a trusted person.',
      'In a crisis, contact a local mental-health hotline or emergency services.',
    ],
  },
];

export function analyzeSymptoms(symptoms: string[]): {
  analysis: string;
  urgency: 'low' | 'moderate' | 'high';
  recommendations: string[];
} {
  const text = symptoms.join(' ').toLowerCase();
  const matched = symptomRules.filter((r) =>
    r.keywords.some((k) => text.includes(k))
  );

  if (matched.length === 0) {
    return {
      analysis:
        'I could not match your symptoms to a specific pattern. This does not mean they are unimportant — if they are bothering you, consider describing them more specifically or consulting a healthcare professional.',
      urgency: 'low',
      recommendations: [
        'Try adding more detail (e.g., body location, duration, severity).',
        'If symptoms worsen or persist, book an appointment with a clinician.',
        'For sudden, severe, or rapidly worsening symptoms, seek emergency care.',
      ],
    };
  }

  const urgencyRank = { low: 0, moderate: 1, high: 2 } as const;
  const top = [...matched].sort(
    (a, b) => urgencyRank[b.urgency] - urgencyRank[a.urgency]
  )[0];

  const recs = Array.from(new Set(matched.flatMap((m) => m.recommendations)));
  return {
    analysis: matched
      .map((m) => m.analysis)
      .join(' '),
    urgency: top.urgency,
    recommendations: recs.slice(0, 6),
  };
}

export const healthDisclaimer =
  'This AI-generated guidance is for informational purposes only and is not a medical diagnosis or a substitute for professional care.';

// Chat assistant: keyword-based responses for common health questions.
export function chatReply(message: string): string {
  const q = message.toLowerCase();

  if (/(hi|hello|hey|good (morning|afternoon|evening))/.test(q)) {
    return "Hello! I'm Vita, your AI health assistant. I can help you understand symptoms, track wellness, book appointments, and more. What would you like to explore today?";
  }
  if (/(bmi|weight|overweight|underweight)/.test(q)) {
    return 'BMI is a quick screening tool based on weight and height. A BMI between 18.5 and 24.9 is generally considered healthy. You can calculate yours on the BMI page — remember it does not account for muscle mass or body composition.';
  }
  if (/(appointment|book|doctor|schedule)/.test(q)) {
    return 'You can book an appointment from the Appointments page. Choose a specialty, pick a date and time, and add any notes for the clinician. Your upcoming visits also appear on the Dashboard.';
  }
  if (/(symptom|pain|ache|fever|cough|nausea|dizzy|rash)/.test(q)) {
    return 'For symptom guidance, try the AI Symptom Checker — select your symptoms and I will analyze them and suggest next steps. If symptoms are severe or sudden, please seek emergency care rather than relying on this tool.';
  }
  if (/(sleep|insomnia|tired|fatigue)/.test(q)) {
    return 'Quality sleep underpins health. Aim for 7–9 hours, keep a consistent schedule, limit screens before bed, and avoid caffeine late in the day. If insomnia persists for more than a few weeks, consider speaking with a clinician.';
  }
  if (/(diet|nutrition|eat|food|weight loss|healthy eating)/.test(q)) {
    return 'A balanced diet emphasizes vegetables, fruits, whole grains, lean protein, and healthy fats, plus plenty of water. Small sustainable changes beat crash diets. For a personalized plan, a registered dietitian can help.';
  }
  if (/(exercise|workout|fitness|activity|run|cardio)/.test(q)) {
    return 'Adults should aim for about 150 minutes of moderate aerobic activity per week plus two strength sessions. Start where you are and build gradually — consistency matters more than intensity.';
  }
  if (/(water|hydrate|hydration)/.test(q)) {
    return 'Most adults do well with about 2–3 liters of fluids daily, more in heat or during exercise. Pale-yellow urine is a simple hydration check.';
  }
  if (/(stress|anxiety|mental|depressed|sad|panic)/.test(q)) {
    return 'Mental health matters as much as physical health. Slow breathing, movement, sleep, and connection all help. If feelings persist or overwhelm you, please reach out to a mental-health professional — and in a crisis, contact emergency services or a hotline.';
  }
  if (/(emergency|urgent|911|ambulance)/.test(q)) {
    return 'If this is a medical emergency, call your local emergency number immediately (e.g., 911, 112, 999). You can also review your saved emergency contacts on the Emergency page.';
  }
  if (/(history|record|past|medical record)/.test(q)) {
    return 'Your Medical History page stores conditions, medications, allergies, surgeries, immunizations, and tests — all private to your account. You can add new entries any time.';
  }
  if (/(thank|thanks)/.test(q)) {
    return "You're welcome! Stay well, and don't hesitate to reach out whenever you need guidance.";
  }
  if (/(article|read|learn|blog)/.test(q)) {
    return 'The Health Articles page has a curated library on wellness, nutrition, mental health, and more. Tap any article to read the full piece.';
  }

  return "I'm here to help with general health questions, symptoms, appointments, BMI, sleep, nutrition, and more. Could you tell me a bit more about what you're experiencing or what you'd like to do?";
}
