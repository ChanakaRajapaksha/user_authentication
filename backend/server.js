const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');
const refreshRoute = require('./routes/refresh');
const logoutRoute = require('./routes/logout');
const forgotPasswordRoute = require('./routes/forgotpassword');
const resetPasswordRoute = require('./routes/resetpassword');
const verifyOTPRoute = require('./routes/verifyotp');

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', registerRoute);
app.use('/auth', authRoute);
app.use('/auth', refreshRoute);
app.use('/auth', logoutRoute);
app.use('/auth', forgotPasswordRoute);
app.use('/auth', resetPasswordRoute);
app.use('/auth', verifyOTPRoute);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
})
