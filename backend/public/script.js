document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('faq-form');
  const questionInput = document.getElementById('question');
  const answerInput = document.getElementById('answerEditor');
  const languagesInput = document.getElementById('languages');
  const faqList = document.getElementById('faq-list');
  const langSelect = document.getElementById('lang-select');

  let editor;
  let currentLang = langSelect ? langSelect.value : 'en';
  let faqs;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const question = questionInput.value;
      const answer = answerInput.value;

      //collect chosen language
      const languageCheckboxes = document.querySelectorAll('#languages input[type="checkbox"]');
      const languages = Array.from(languageCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
      // console.log('Languages being sent:', languages);
      
      await fetch('http://localhost:5000/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, languages })
      });

      alert(`FAQ created successfully with languages: ${languages.join(', ')}`);
      window.location.href = 'index.html?newFaq=true';
    });
  }

  if (faqList) {
    window.onload = function() {
      loadFAQs();
    }
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      // console.log('Selected language:', currentLang);
      loadFAQs();
    });
    async function loadFAQs() {
      console.log('Loading FAQs for language:', currentLang);
      const res = await fetch(`http://localhost:5000/api/faqs?lang=${currentLang}`);
      faqs = await res.json();
      faqList.innerHTML = faqs.reverse().map(faq => `
        <div class="faq-item">
          <div class="faq-content">
            <h3>${faq.question}</h3>
            <p>${faq.answer}</p>
          </div>
          <button style="background-color: #dc3545; color: white; padding: 5px 10px; border: none; border-radius: 4px; transition: background-color 0.3s;" onclick="deleteFAQ('${faq.id}')">Delete</button>
        </div>
      `).join('');
    } 

    async function deleteFAQ(faqId) {
      // console.log(faqId);
      const confirmation = confirm("Are you sure you want to delete this FAQ?");
      if (confirmation) {
        try {
          const res = await fetch(`http://localhost:5000/api/faqs/${faqId}`, {
            method: 'DELETE',
          });
          if (!res.ok) {
            throw new Error('Failed to delete FAQ');
          }
          loadFAQs();
        } catch (error) {
          console.error('Error deleting FAQ:', error);
          alert('There was an error deleting the FAQ. Please try again.');
        }
      }
    }
    window.deleteFAQ = deleteFAQ;
  }
});

