const Mailjet = require('node-mailjet');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
  async send(req, res) {
    try {
      const { name, email, subject, message } = req.allParams();

      const errors = [];
      if (!name    || String(name).trim().length    < 2  || String(name).length    > 100) errors.push('name');
      if (!email   || !EMAIL_RE.test(String(email)) || String(email).length        > 254) errors.push('email');
      if (!subject || String(subject).trim().length < 3  || String(subject).length > 200) errors.push('subject');
      if (!message || String(message).trim().length < 5  || String(message).length > 5000) errors.push('message');

      if (errors.length) {
        return res.badRequest({ ok: false, error: 'validation_failed', fields: errors });
      }

      const mailjet = Mailjet.apiConnect(
        sails.config.custom.mailjetApiKey,
        sails.config.custom.mailjetApiSecret
      );

      const safe = (s) => String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

      const result = await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
          From:    { Email: sails.config.custom.mailFrom, Name: 'Contact Form' },
          To:      [{ Email: sails.config.custom.mailTo,  Name: 'Site Owner'  }],
          ReplyTo: { Email: email, Name: name },
          Subject: `[Contact] ${subject}`,
          TextPart: `Ім'я: ${name}\nEmail: ${email}\n\n${message}`,
          HTMLPart: `
            <h3>Нове повідомлення з форми</h3>
            <p><b>Ім'я:</b> ${safe(name)}</p>
            <p><b>Email:</b> ${safe(email)}</p>
            <p><b>Тема:</b> ${safe(subject)}</p>
            <p><b>Повідомлення:</b><br>${safe(message).replace(/\n/g, '<br>')}</p>
          `
        }]
      });

      const status = result.body.Messages[0].Status;
      return res.ok({ ok: true, status });
    } catch (err) {
      sails.log.error('Mailjet error:', err && err.statusCode, err && err.message);
      return res.serverError({ ok: false, error: 'send_failed' });
    }
  }
};
