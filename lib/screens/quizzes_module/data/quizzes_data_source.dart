import 'package:injectable/injectable.dart';

@injectable
class QuizzesDataSource {
  final List<Map<String, dynamic>> questions = [
    {
      "category": "General Knowledge",
      "categoryMr": "सामान्य ज्ञान",
      "q": "Which district of Maharashtra has the highest forest cover area?",
      "qMr": "महाराष्ट्रातील कोणत्या जिल्ह्यात जंगलाचे प्रमाण सर्वात जास्त आहे?",
      "options": ["Gadchiroli", "Nagpur", "Ratnagiri", "Thane"],
      "optionsMr": ["गडचिरोली", "नागपूर", "रत्नागिरी", "ठाणे"],
      "correctIndex": 0,
      "explanation": "Gadchiroli has over 75% of its total area under forest cover, which is the highest in Maharashtra.",
      "explanationMr": "गडचिरोली जिल्ह्याचे ७५% पेक्षा जास्त क्षेत्र जंगलाने व्यापलेले आहे, जे महाराष्ट्रात सर्वाधिक आहे."
    },
    {
      "category": "Marathi Grammar",
      "categoryMr": "मराठी व्याकरण",
      "q": "Identify the type of noun: 'कालिदास हा भारताचा शेक्सपिअर आहे.'",
      "qMr": "नामाचा प्रकार ओळखा: 'कालिदास हा भारताचा शेक्सपिअर आहे.'",
      "options": ["Proper Noun", "Common Noun", "Abstract Noun", "Collective Noun"],
      "optionsMr": ["विशेषनाम", "सामान्यनाम", "भाववाचक नाम", "धातुसाधित नाम"],
      "correctIndex": 1,
      "explanation": "Here 'Shakespeare' is used as a comparison for a class of people, making it a Common Noun.",
      "explanationMr": "येथे 'शेक्सपिअर' चा वापर उपमा देण्यासाठी केला आहे, म्हणून ते सामान्यनाम आहे."
    },
    {
      "category": "Mathematics",
      "categoryMr": "गणित",
      "q": "Find the average of first 50 natural numbers.",
      "qMr": "पहिल्या ५० नैसर्गिक संख्यांची सरासरी काढा.",
      "options": ["25.0", "25.5", "26.0", "26.5"],
      "optionsMr": ["२५.०", "२५.५", "२६.०", "२६.५"],
      "correctIndex": 1,
      "explanation": "Formula: (n + 1) / 2 => (50 + 1) / 2 = 25.5",
      "explanationMr": "सूत्र: (n + 1) / 2 => (५० + १) / २ = २५.५"
    },
    {
      "category": "Intellectual Ability",
      "categoryMr": "बुद्धिमत्ता चाचणी",
      "q": "Find the missing number: 2, 6, 12, 20, 30, ?",
      "qMr": "गाळलेली संख्या शोधा: २, ६, १२, २०, ३०, ?",
      "options": ["36", "40", "42", "46"],
      "optionsMr": ["३६", "४०", "४२", "४६"],
      "correctIndex": 2,
      "explanation": "The differences are consecutive even numbers: +4, +6, +8, +10, +12. 30 + 12 = 42.",
      "explanationMr": "संख्यांमधील फरक सम संख्यांमध्ये वाढतो: +४, +६, +८, +१०, +१२. ३० + १२ = ४२."
    }
  ];

  Future<List<Map<String, dynamic>>> getMockQuestions() async {
    // Simulated delay for fetching questions
    await Future.delayed(const Duration(milliseconds: 100));
    return questions;
  }
}
