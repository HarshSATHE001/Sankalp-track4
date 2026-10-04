const R=(a,b,c)=>({en:a,hi:b,mr:c});
export const SRC={own:R('My own savings','अपनी बचत','माझी स्वतःची बचत'),emergency:R('Emergency money','आपातकालीन पैसा','आणीबाणीचे पैसे'),loan:R('Loan / borrowed','कर्ज / उधार','कर्ज / उसने')};
export const WHY={tip:R('Saw a tip','टिप देखी','टिप पाहिली'),recover:R('Recover a loss','घाटा वसूलना','तोटा भरून काढणे'),plan:R('My own plan','मेरी अपनी योजना','माझी स्वतःची योजना'),other:R('Other','अन्य','इतर')};
export const HZ={day:R('Today','आज','आज'),weeks:R('Weeks','हफ़्ते','आठवडे'),years:R('Years','साल','वर्षे')};
export const RS={streak:R('{v} losses in a row','लगातार {v} घाटे','सलग {v} तोटे'),cum:R('Recent loss is {v}% of capital','हाल का घाटा पूँजी का {v}%','अलीकडील तोटा भांडवलाच्या {v}%'),lev:R('Leverage {v}x is high','लीवरेज {v}x ज़्यादा है','लीव्हरेज {v}x जास्त आहे'),size:R('{v}x your average size after a loss','घाटे के बाद औसत का {v} गुना','तोट्यानंतर सरासरीच्या {v} पट रक्कम'),burst:R('{v} trades in a short time','थोड़े समय में {v} ट्रेड','थोड्या वेळात {v} ट्रेड'),night:R('Late night (around {v}:00)','देर रात ({v}:00 के आसपास)','रात्री उशिरा ({v}:00 च्या सुमारास)'),src:R('Money source: {v}','पैसे का स्रोत: {v}','पैशांचा स्रोत: {v}')};
export const L={
 app:R('Pause. Reflect. Decide.','रुकिए. सोचिए. फ़ैसला कीजिए.','थांबा. विचार करा. निर्णय घ्या.'),
 practice:R('Practice only: zero real money, random simulated prices (not predictions).','सिर्फ़ अभ्यास: असली पैसा नहीं, यादृच्छिक कीमतें (अनुमान नहीं).','फक्त सराव: खरे पैसे नाहीत, यादृच्छिक किमती (अंदाज नाहीत).'),
 pin:R('Create or enter your PIN (encrypts your notes on this phone)','PIN बनाएँ या डालें (नोट्स इसी फ़ोन में एन्क्रिप्ट होंगे)','PIN तयार करा किंवा टाका (नोंदी याच फोनमध्ये एन्क्रिप्ट होतात)'),
 open:R('Open','खोलें','उघडा'),badpin:R('Wrong PIN','गलत PIN','चुकीचा PIN'),
 cap:R('Practice capital','अभ्यास पूँजी','सराव भांडवल'),size:R('Amount (₹)','राशि (₹)','रक्कम (₹)'),lev:R('Leverage (x)','लीवरेज (x)','लीव्हरेज (x)'),
 src:R('Where is this money from?','यह पैसा कहाँ से है?','हे पैसे कुठून आले?'),why:R('Why am I doing this?','मैं यह क्यों कर रहा हूँ?','मी हे का करत आहे?'),hz:R('For how long?','कितने समय के लिए?','किती कालावधीसाठी?'),
 buy:R('Place practice order (buy)','अभ्यास ऑर्डर (खरीद)','सराव ऑर्डर (खरेदी)'),needwhy:R('Pick a reason first','पहले कारण चुनें','आधी कारण निवडा'),
 lockT:R('Take a pause','थोड़ा रुकिए','थोडा थांबा'),
 lockM:R('Your trading shows signs of haste. Take a deep breath. Are you making this decision with a calm mind?','आपकी ट्रेडिंग में जल्दबाज़ी के संकेत दिख रहे हैं। एक गहरी साँस लें। क्या यह फ़ैसला आप शांत मन से ले रहे हैं?','तुमच्या ट्रेडिंगमध्ये घाईचे संकेत दिसत आहेत. एक दीर्घ श्वास घ्या. हा निर्णय तुम्ही शांत मनाने घेत आहात का?'),
 poss:R('Possible pattern (not advice):','संभावित पैटर्न (सलाह नहीं):','संभाव्य पॅटर्न (सल्ला नाही):'),
 wait:R('Cooling-off: {v}s','ठहराव: {v} सेकंड','थांबा: {v} सेकंद'),
 say:R('Say or type your reason','अपना कारण बोलें या लिखें','तुमचे कारण बोला किंवा लिहा'),mic:R('🎤 Speak','🎤 बोलें','🎤 बोला'),
 micNote:R('Voice uses your browser\'s speech service in this prototype. You can type instead.','इस प्रोटोटाइप में आवाज़ ब्राउज़र की स्पीच सेवा इस्तेमाल करती है। आप टाइप भी कर सकते हैं।','या प्रोटोटाइपमध्ये आवाज ब्राउझरची स्पीच सेवा वापरते. तुम्ही टाइपही करू शकता.'),
 save:R('Save reason & continue','कारण सहेजें और आगे बढ़ें','कारण जतन करा आणि पुढे जा'),cancel:R('Cancel this order','यह ऑर्डर रद्द करें','हा ऑर्डर रद्द करा'),
 goalOf:R('This order is {v}% of your goal','यह ऑर्डर आपके लक्ष्य का {v}% है','हा ऑर्डर तुमच्या ध्येयाच्या {v}% आहे'),
 goal:R('Goal this money is for','यह पैसा किस लक्ष्य के लिए है','हे पैसे कोणत्या ध्येयासाठी आहेत'),goalAmt:R('Goal amount (₹)','लक्ष्य राशि (₹)','ध्येय रक्कम (₹)'),
 demo:R('Load Ramesh demo (3 losses)','रमेश डेमो (3 घाटे)','रमेश डेमो (3 तोटे)'),
 tabs:R('Practice|Replay Lab|Goal & Privacy','अभ्यास|रीप्ले|लक्ष्य व गोपनीयता','सराव|रीप्ले|ध्येय व गोपनीयता'),
 nudge:R('Unusual size compared with your own history (soft notice).','आपके इतिहास की तुलना में असामान्य राशि (हल्की सूचना).','तुमच्या इतिहासापेक्षा असामान्य रक्कम (सौम्य सूचना).'),
 bypass:R('Test: force an order while locked','जाँच: लॉक में ऑर्डर भेजें','चाचणी: लॉक असताना ऑर्डर पाठवा'),
 stats:R('Locks {a} · Cancelled {b} · Continued {c} · Reflection completed {d}%','लॉक {a} · रद्द {b} · जारी {c} · चिंतन पूर्ण {d}%','लॉक {a} · रद्द {b} · पुढे {c} · चिंतन पूर्ण {d}%'),
 rep:R('Same scripted session, with and without SANKALP. Simulation, not a pilot result; assumes the user cancels a locked order.','वही स्क्रिप्टेड सत्र, SANKALP के साथ और बिना। यह सिमुलेशन है, पायलट नतीजा नहीं; मान्यता: लॉक होने पर यूज़र ऑर्डर रद्द करता है।','तेच स्क्रिप्टेड सत्र, SANKALP सह आणि शिवाय. हे सिम्युलेशन आहे, पायलट निकाल नाही; गृहीतक: लॉक झाल्यास वापरकर्ता ऑर्डर रद्द करतो.'),
 csv:R('Import trade log (CSV: time,side,size,lev,pnl). Read only in this browser.','ट्रेड लॉग इम्पोर्ट (CSV: time,side,size,lev,pnl). केवल इसी ब्राउज़र में पढ़ा जाता है।','ट्रेड लॉग इम्पोर्ट (CSV: time,side,size,lev,pnl). फक्त याच ब्राउझरमध्ये वाचला जातो.'),
 consent:R('I consent to read this file on this device','मैं इस डिवाइस पर फ़ाइल पढ़ने की सहमति देता/देती हूँ','मी या डिव्हाइसवर फाइल वाचण्यास संमती देतो/देते'),
 priv:R('Stored only on this device, encrypted with your PIN: your trades and reasons. No SMS, OTP, account access, analytics or ads. No stock tips or predictions.','केवल इसी डिवाइस पर, आपके PIN से एन्क्रिप्टेड: ट्रेड और कारण। कोई SMS, OTP, खाता एक्सेस, एनालिटिक्स या विज्ञापन नहीं। कोई स्टॉक टिप या अनुमान नहीं।','फक्त याच डिव्हाइसवर, तुमच्या PIN ने एन्क्रिप्टेड: ट्रेड आणि कारणे. SMS, OTP, खाते-प्रवेश, अ‍ॅनालिटिक्स किंवा जाहिराती नाहीत. स्टॉक टिप किंवा अंदाज नाहीत.'),
 wipe:R('Delete all my data','मेरा सारा डेटा मिटाएँ','माझा सर्व डेटा हटवा'),big:R('Large text','बड़ा text','मोठा मजकूर'),
 journal:R('Saved reasons','सहेजे कारण','जतन केलेली कारणे')};
export const t=(o,l,v)=>(o[l]||o.en).replace('{v}',v);
Object.assign(L,{
 tabsN:R('Trade|Journal|Insights|Trust','ट्रेड|जर्नल|इनसाइट|भरोसा','ट्रेड|जर्नल|अंतर्दृष्टी|विश्वास'),
 buyS:R('Buy','खरीदें','खरेदी'),sellS:R('Sell','बेचें','विक्री'),place2:R('Place practice order','अभ्यास ऑर्डर दें','सराव ऑर्डर द्या'),
 exitNo:R('Continue without a reason','बिना कारण आगे बढ़ें','कारणाशिवाय पुढे जा'),falseLock:R('This pause was not needed','यह ठहराव ज़रूरी नहीं था','हा थांबा गरजेचा नव्हता'),
 breathe:R('Breathe in… and out…','साँस अंदर… और बाहर…','श्वास आत… आणि बाहेर…'),
 report:R('Your calm-down report','आपकी शांति रिपोर्ट','तुमचा शांतता अहवाल'),noAdv:R('Patterns only. No advice.','सिर्फ़ पैटर्न। कोई सलाह नहीं।','फक्त पॅटर्न. सल्ला नाही.'),
 pauses:R('Pauses','ठहराव','थांबे'),refl:R('Reasons written','कारण लिखे','कारणे लिहिली'),late:R('Late-night orders','देर रात के ऑर्डर','रात्री उशिराचे ऑर्डर'),canc:R('Orders cancelled','रद्द ऑर्डर','रद्द ऑर्डर'),
 zero:R('Data requests made by this app: {v}','इस ऐप के डेटा अनुरोध: {v}','या अ‍ॅपने केलेले डेटा अनुरोध: {v}'),
 sens:R('Sensitivity','संवेदनशीलता','संवेदनशीलता'),sensO:R('gentle|balanced|strict','हल्का|संतुलित|सख़्त','सौम्य|संतुलित|कडक'),
 logT:R('Decision log (encrypted on this phone)','निर्णय लॉग (इस फ़ोन पर एन्क्रिप्टेड)','निर्णय नोंदवही (या फोनवर एन्क्रिप्टेड)'),empty:R('No entries yet. Place a practice order.','अभी कोई प्रविष्टि नहीं।','अजून नोंद नाही.'),raw:R('Show encrypted data','एन्क्रिप्टेड डेटा दिखाएँ','एन्क्रिप्टेड डेटा दाखवा'),
 voiceOff:R('Voice needs browser speech (opt-in, see Trust). You can type instead.','आवाज़ के लिए ब्राउज़र स्पीच चाहिए (भरोसा टैब में चुनें)। आप टाइप कर सकते हैं।','आवाजासाठी ब्राउझर स्पीच लागते (विश्वास टॅबमध्ये निवडा). तुम्ही टाइप करू शकता.')});
