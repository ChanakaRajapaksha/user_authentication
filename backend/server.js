const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const session = require('express-session');

const authRoute = require('./routes/auth');
const rolesRoute = require('./routes/roles');
const patientRoute = require('./routes/patient');

require('dotenv').config();

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Middleware for sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Microsoft OIDC Strategy
passport.use(
    new OIDCStrategy(
        {
            identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
            clientID: process.env.AZURE_AD_CLIENT_ID,
            responseType: 'code',
            responseMode: 'query',
            redirectUrl: process.env.AZURE_AD_CALLBACK_URL,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            scope: ['profile', 'offline_access', 'email'],
        },
        (iss, sub, profile, accessToken, refreshToken, done) => {
            if (!profile) {
                return done(new Error('No profile received'), null);
            }
            return done(null, profile);
        }
    )
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Microsoft Auth Routes
app.get('/auth/microsoft', passport.authenticate('azuread-openidconnect'));

app.get(
    '/auth/microsoft/callback',
    passport.authenticate('azuread-openidconnect', {
        failureRedirect: '/',
    }),
    (req, res) => {
        res.redirect('/dashboard'); // Or another route
    }
);

app.use('/auth', authRoute);
app.use('/api', rolesRoute);
app.use('/api', patientRoute);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
})