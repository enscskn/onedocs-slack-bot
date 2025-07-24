require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const slackRoutes = require('./routes/slack');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/slack', slackRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Slack bot aktif → http://localhost:${PORT}`));
