/**
 * src/i18n.js - SANKALP Trilingual Vernacular Engine (English, Hindi, Marathi)
 * 
 * Guardrail 3: No financial advice, targets, or certainty claims.
 * Wording strictly stays possible pattern, reflective pause, simulated, not predictions.
 */

export const R = (en, hi, mr) => ({ en, hi, mr });

export const SRC = {
  self: R('My Own Plan', 'मेरी अपनी योजना', 'माझी स्वतःची योजना'),
  tip: R('Saw a tip', 'टिप पाहिली / देखी', 'टिप पाहिली'),
  social: R('Social media idea', 'सोशल मीडिया कल्पना', 'सोशल मीडिया कल्पना'),
  news: R('News event', 'समाचार घटना', 'बातम्यांची घटना')
};

export const WHY = {
  setup: R('Technical setup', 'तकनीकी सेटअप', 'तांत्रिक सेटअप'),
  fomo: R('Fear of missing move', 'चूक जाने का डर (FOMO)', 'संधी हुकण्याची भीती (FOMO)'),
  recovery: R('Recovering earlier loss', 'पिछला नुकसान पूरा करना', 'मागील तोटा भरून काढणे'),
  breakout: R('Breakout momentum', 'ब्रेकआउट गति', 'ब्रेकआउट गती')
};

export const HZ = {
  intraday: R('Intraday (Close today)', 'इंट्राडे (आज ही बंद करें)', 'इंट्राडे (आजच बंद करा)'),
  swing: R('Swing (Few days)', 'स्विंग (कुछ दिन)', 'स्विंग (काही दिवस)'),
  delivery: R('Positional / Delivery', 'डिलीवरी / पोजीशनल', 'डिलिव्हरी / पोझिशनल')
};

export const RS = {
  streak: R('consecutive losses detected', 'लगातार नुकसान के सौदे मिले', 'सलग तोट्याचे व्यवहार आढळले'),
  lev: R('high leverage exceeds safety limit', 'उच्च लिवरेज सीमा पार कर गया', 'जास्त लिव्हरेज मर्यादा ओलांडली'),
  size: R('trade size escalated significantly', 'ऑर्डर का आकार असामान्य रूप से बढ़ा', 'ऑर्डरचा आकार असामान्य वाढला'),
  night: R('late-night fatigue trading window', 'देर रात की थकान में ट्रेडिंग', 'मध्यरात्रीच्या थकव्यात ट्रेडिंग'),
  src: R('external social influence reported', 'बाहरी प्रभाव दर्ज किया गया', 'बाहेरचा प्रभाव नोंदवला गेला')
};

export const L = {
  appName: R('SANKALP', 'संकल्प', 'संकल्प'),
  tagline: R('Pause. Reflect. Decide.', 'ठहरें। सोचें। निर्णय लें।', 'थांबा. विचार करा. निर्णय घ्या.'),
  zero: R('Requests carrying your data: 0', 'आपका डेटा ले जाने वाले अनुरोध: 0', 'तुमचा डेटा पाठवणाऱ्या विनंत्या: 0'),
  staticLoaded: R('Static files loaded', 'स्थिर फाइलें लोड हुईं', 'स्थिर फाइल्स लोड केल्या'),
  simulatedNotice: R('Prices are simulated, not predictions', 'कीमतें सिम्युलेटेड हैं, भविष्यवाणियां नहीं', 'किंमती सिम्युलेटेड आहेत, अंदाज नाहीत'),
  patternsNotice: R('Possible patterns only. No advice.', 'केवल संभावित पैटर्न। कोई सलाह नहीं।', 'केवळ संभाव्य पॅटर्न. कोणताही सल्ला नाही.'),
  practiceTab: R('Practice Terminal', 'अभ्यास टर्मिनल', 'सराव टर्मिनल'),
  journalTab: R('Decision Journal', 'निर्णय डायरी', 'निर्णय नोंदवही'),
  insightsTab: R('Weekly Report', 'साप्ताहिक रिपोर्ट', 'साप्ताहिक अहवाल'),
  trustTab: R('Privacy & Trust', 'गोपनीयता और विश्वास', 'गोपनीयता आणि विश्वास'),
  pinTitle: R('Enter Security PIN', 'सुरक्षा पिन दर्ज करें', 'सुरक्षा पिन टाका'),
  pinSub: R('4+ digits. Encrypted locally with PBKDF2 + AES-GCM.', '4+ अंक। PBKDF2 + AES-GCM द्वारा स्थानीय रूप से एन्क्रिप्टेड।', '4+ अंक. स्थानिकरित्या PBKDF2 + AES-GCM ने एन्क्रिप्ट केलेले.'),
  unlockBtn: R('Unlock Vault', 'वॉल्ट खोलें', 'वॉल्ट उघडा'),
  lockNow: R('Lock App', 'ऐप लॉक करें', 'ॲप लॉक करा'),
  placeOrder: R('Submit Order', 'ऑर्डर सबमिट करें', 'ऑर्डर सबमिट करा'),
  circuitActive: R('Circuit-Breaker Active', 'सर्किट ब्रेकर सक्रिय', 'सर्किट ब्रेकर सक्रिय'),
  coolingDown: R('Cooling-off Timer', 'कूलिंग-ऑफ टाइमर', 'कूलिंग-ऑफ टाइमर'),
  cancelTrade: R('Cancel Order (Reflect & Step Back)', 'ऑर्डर रद्द करें (रुकें और सोचें)', 'ऑर्डर रद्द करा (थांबा आणि विचार करा)'),
  proceedTrade: R('Proceed After Timer', 'टाइमर के बाद आगे बढ़ें', 'टाइमर संपल्यावर पुढे जा'),
  speakReason: R('Speak or write your reasoning', 'अपना कारण बोलें या लिखें', 'तुमचे कारण बोला किंवा लिहा'),
  recordAudio: R('Record Voice', 'आवाज रिकॉर्ड करें', 'आवाज रेकॉर्ड करा'),
  stopRecord: R('Stop Recording', 'रिकॉर्डिंग रोकें', 'रेकॉर्डिंग थांबवा'),
  saveJournal: R('Save Reflection', 'चिंतन सहेजें', 'विचार जतन करा'),
  rameshDemoBtn: R('Load Ramesh Demo (Kolhapur)', 'रमेश डेमो लोड करें (कोल्हापुर)', 'रमेश डेमो लोड करा (कोल्हापूर)'),
  bhashiniTtsLabel: R('Spoken lock message by Bhashini (pre-recorded; nothing is sent)', 'भाषिणी द्वारा बोला गया संदेश (प्री-रेकॉर्डेड; कुछ भी भेजा नहीं जाता)', 'भाषिणी द्वारे बोललेला संदेश (प्री-रेकॉर्डेड; काहीही पाठवले जात नाही)'),
  voiceInputLabel: R('Voice Journaling (Web Speech API; processed by browser vendor)', 'आवाज इनपुट (ब्राउज़र प्रदाता द्वारा प्रोसेस किया गया)', 'व्हॉइस इनपुट (ब्राउझर पुरवठादाराद्वारे प्रोसेस केलेले)'),
  wipeDataBtn: R('Wipe All Local Data', 'सभी स्थानीय डेटा मिटाएं', 'सर्व स्थानिक डेटा नष्ट करा'),
  sampleLogs: R('Try a sample log', 'एक नमूना लॉग आज़माएं', 'नमुना लॉग वापरून पहा'),
  importCsvBtn: R('Import Trade CSV', 'ट्रेड CSV आयात करें', 'ट्रेड CSV आयात करा'),
  lockM: R('Safety pause active. Take a deep breath and review your reasoning.', 'सुरक्षा ठहराव सक्रिय है। एक गहरी सांस लें और अपने तर्क की समीक्षा करें।', 'सुरक्षा ब्रेक सक्रिय आहे. दीर्घ श्वास घ्या आणि आपल्या कारणाचा पुनर्विचार करा.'),
  breathe: R('Take a slow breath. Impulsive decisions often feel urgent.', 'धीमी सांस लें। जल्दबाजी के फैसले अक्सर बहुत जरूरी लगते हैं।', 'हळूवार श्वास घ्या. भावनेच्या भरात घेतलेले निर्णय तातडीचे वाटतात.'),
  nudge: R('Possible behavioral anomaly detected. Proceed with care.', 'संभावित व्यवहार विसंगति पाई गई। सावधानी से आगे बढ़ें।', 'संभाव्य वर्तणूक विसंगती आढळली. काळजीपूर्वक निर्णय घ्या.')
};

export function t(entry, lang = 'en') {
  if (!entry) return '';
  if (typeof entry === 'string') return entry;
  return entry[lang] || entry.en || '';
}
