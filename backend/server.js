const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const faqRoutes = require('./routes/faqRoutes');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*'  
  }));

app.use(bodyParser.json());
app.use('/api', faqRoutes);

const PORT = process.env.PORT || 5000;

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 