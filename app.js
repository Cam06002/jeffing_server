const express = require('express');
const bodyParser = require('body-parser');

const fileRoutes = require('./routes/file-routes');

const app = express();

app.use('/api/files', fileRoutes);

app.listen(5000);