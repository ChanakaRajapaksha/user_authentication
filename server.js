const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');
const refreshRoute = require('./routes/refresh');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', registerRoute);
app.use('/auth', authRoute);
app.use('/auth', refreshRoute);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
})
