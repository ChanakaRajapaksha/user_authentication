const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoute);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
})
