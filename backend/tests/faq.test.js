const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai'); 
const app = require('../server'); 
const FAQ = require('../models/faq');

describe('FAQ API', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });
  after(async () => {
    await FAQ.deleteMany({});
    await mongoose.connection.close();
  });
  
  //retrival test
  describe('GET /api/faqs', () => {
    it('should return all FAQs', async () => {
      const faq = new FAQ({ question: 'Sample Question', answer: 'Sample Answer', translations: { ques: {}, ans: {} } });
      await faq.save();

      const res = await request(app).get('/api/faqs');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });
  });
  
  //creatin test
  describe('POST /api/faqs', () => {
    it('should create a new FAQ', async () => {
      const newFAQ = {
        question: 'New Question',
        answer: 'New Answer',
        languages: ['es', 'fr'], 
      };

      const res = await request(app).post('/api/faqs').send(newFAQ);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('question', 'New Question');
      expect(res.body).to.have.property('answer', 'New Answer');
    });
  });

  //deletion test
  describe('DELETE /api/faqs/:id', () => {
    it('should delete an FAQ', async () => {
      const faq = new FAQ({ question: 'Delete Me', answer: 'Delete This Answer', translations: { ques: {}, ans: {} } });
      await faq.save();

      const res = await request(app).delete(`/api/faqs/${faq._id}`); 
      expect(res.status).to.equal(204);

      const deletedFAQ = await FAQ.findById(faq._id);
      expect(deletedFAQ).to.be.null; 
    });
  });
}); 