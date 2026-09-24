


require('dotenv').config();
require('./config/db');

const app = require('./app'); // ✅ IMPORT your real app

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});