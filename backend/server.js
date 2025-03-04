const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const prisma = require('./database/prismaClient');

// const { withAuth } = require('./middleware/authMiddleware')

const authRoute = require('./routes/auth');
const rolesRoute = require('./routes/roles');
const patientRoute = require('./routes/patient');
const usersRoute = require('./routes/user');

//Master Data Routes
const appointmentStatusRoutes = require('./routes/MasterData/GeneralSettings/appointmentStatus');
const scheduleTypeRoutes = require('./routes/MasterData/GeneralSettings/scheduleType');
const countryRoutes = require('./routes/MasterData/GeneralSettings/country');
const callStatusRoutes = require('./routes/MasterData/GeneralSettings/callStatus');
const employmentTypeRoutes = require('./routes/MasterData/GeneralSettings/employmentType');
const emiratesRoutes = require('./routes/MasterData/GeneralSettings/emirates');
const mainDistrictRoutes = require('./routes/MasterData/GeneralSettings/mainDistrict');
const districtRoutes = require('./routes/MasterData/GeneralSettings/district');
const communityRoutes = require('./routes/MasterData/GeneralSettings/community');
const languageRoutes = require('./routes/MasterData/GeneralSettings/language');
const resourceTypeRoutes = require('./routes/MasterData/GeneralSettings/resourceType');
const informationSourceRoutes = require('./routes/MasterData/GeneralSettings/informationSource');
const patientTypeRoutes = require('./routes/MasterData/GeneralSettings/patientType');
const nurseTypeRoutes = require('./routes/MasterData/GeneralSettings/nurseType');
const patientPriorityRoutes = require('./routes/MasterData/GeneralSettings/patientPriority');
const overBookingRoutes = require('./routes/MasterData/GeneralSettings/overBooking');
const encounterTypeRoutes = require('./routes/MasterData/GeneralSettings/encounterType');
const otherIdTypeRoutes = require('./routes/MasterData/GeneralSettings/otherIdType');
const blockTypeRoutes = require('./routes/MasterData/GeneralSettings/blockType');
const sessionTimeoutRoutes = require('./routes/MasterData/GeneralSettings/sessionTimeout');

require('dotenv').config();

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// app.use(withAuth(prisma));

app.use('/auth', authRoute);
app.use('/api', rolesRoute);
app.use('/patients', patientRoute)
app.use('/api', usersRoute);

app.use('/master/general', appointmentStatusRoutes);
app.use('/master/general', scheduleTypeRoutes);
app.use('/master/general', countryRoutes);
app.use('/master/general', callStatusRoutes);
app.use('/master/general', employmentTypeRoutes);
app.use('/master/general', emiratesRoutes);
app.use('/master/general', mainDistrictRoutes);
app.use('/master/general', districtRoutes);
app.use('/master/general', communityRoutes);
app.use('/master/general', languageRoutes);
app.use('/master/general', resourceTypeRoutes);
app.use('/master/general', informationSourceRoutes);
app.use('/master/general', patientTypeRoutes);
app.use('/master/general', nurseTypeRoutes);
app.use('/master/general', patientPriorityRoutes);
app.use('/master/general', overBookingRoutes);
app.use('/master/general', encounterTypeRoutes);
app.use('/master/general', otherIdTypeRoutes);
app.use('/master/general', blockTypeRoutes);
app.use('/master/general', sessionTimeoutRoutes);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
})