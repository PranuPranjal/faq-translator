const FAQ = require('../models/faq');
const {TranslationServiceClient} = require('@google-cloud/translate');
const redis = require('ioredis');
const client = new redis();

const translatetext = new TranslationServiceClient();
const projectId = 'project_id'; //add your google cloud trnaslate project id
const location = 'global';

//faq from cache(using redis)
async function getCacheFAQ(faqId, lang) {
  const cachedData = await client.get(`faq_${faqId}_${lang}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
}

//cache faq to redis
async function cacheFAQ(faqId, lang, faqData) {
  await client.set(`faq_${faqId}_${lang}`, JSON.stringify(faqData), 'EX', 3600);
}

//translate faq(using google cloud translation)
async function translateQuestion(question, answer, targetLang) {
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [question, answer],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: targetLang,
        };
  try {
    const [res] = await translatetext.translateText(request);
    // console.log(res.translations[1].translatedText);
    return res.translations
  } catch (err) {
    console.error('Translation failed:', err);
    return question; //fallback to original ques/ans incase translation not available
  }
}

//faq retrival
async function getFAQs(req, res) {
  const lang = req.query.lang || 'en';
  const faqs = await FAQ.find();
  const translatedFAQs = faqs.map(async (faq) => {
    const cachedData = await getCacheFAQ(faq._id, lang);
    if (cachedData) {
      return cachedData;
    }
    let translatedQuestion = faq.translations.ques[lang];
    let translatedAnswer = faq.translations.ans[lang];
    // console.log(translatedQuestion);
    if (translatedQuestion == undefined) {
      translatedQuestion = faq.question;
      translatedAnswer = faq.answer;
      }
    const faqData = {
      question: translatedQuestion,
      answer: translatedAnswer,
      id: faq._id,
    };
    await cacheFAQ(faq._id, lang, faqData);
    return faqData;
  });
  Promise.all(translatedFAQs).then(faqs => res.json(faqs));
}

//create new faq
async function createFAQ(req, res) {
  const { question, answer, languages } = req.body;
  const faq = new FAQ({ question, answer, translations: { ques: {}, ans: {}} });

  for (let lang of languages) {
    const translatedQuestion = await translateQuestion(question, answer, lang);
    faq.translations.ques[lang] = translatedQuestion[0].translatedText;
    faq.translations.ans[lang] = translatedQuestion[1].translatedText;
  }

  await faq.save();
  res.status(201).json(faq);
}

//delete existing faq
async function deleteFAQ(req, res) {
  const faqId = req.params.id;
  // console.log(faqId);
  try {
    const result = await FAQ.findByIdAndDelete(faqId);

    if (!result) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getFAQs, createFAQ, deleteFAQ };