const form = document.getElementById('coffee-form');
const statusEl = document.getElementById('status');

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  const formData = new FormData(form);

  const payload = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    amount: Number(formData.get('amount'))
  };

  button.disabled = true;
  setStatus('Sending STK push...', '');

  try {
    const response = await fetch('/api/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send STK push.');
    }

    setStatus(data.message || 'STK Push sent. Check your phone.', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    button.disabled = false;
  }
});
