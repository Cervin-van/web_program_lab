const path = require('path');

module.exports.routes = {
  'GET /': (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '.tmp', 'public', 'index.html'));
  },

  'POST /api/contact': 'ContactController.send'
};
