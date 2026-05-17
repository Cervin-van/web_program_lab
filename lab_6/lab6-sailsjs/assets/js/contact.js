document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('status');
  const data = Object.fromEntries(new FormData(form).entries());

  status.className = '';
  status.textContent = 'Відправляється...';

  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await r.json().catch(() => ({}));

    if (r.ok && json.ok) {
      status.className = 'ok';
      status.textContent = 'Повідомлення надіслано. Дякуємо!';
      form.reset();
    } else if (r.status === 400 && json.fields) {
      status.className = 'err';
      status.textContent = 'Помилка валідації у полях: ' + json.fields.join(', ');
    } else {
      status.className = 'err';
      status.textContent = 'Не вдалось надіслати. Спробуйте пізніше.';
    }
  } catch (err) {
    status.className = 'err';
    status.textContent = 'Помилка мережі.';
  }
});
