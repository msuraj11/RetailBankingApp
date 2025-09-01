import express from 'express';
import {rateLimit} from 'express-rate-limit';

import connectDB from './config/db.js';
import newUsersRoute from './routes/api/users.js';
import userAuthRoute from './routes/api/auth.js';
import userAccountInfoRoute from './routes/api/accountInfo.js';
import profileRoute from './routes/api/profile.js';
import transactionsRoute from './routes/api/transactions.js';

import newAdminRoute from './routes/api/adminRoutes/adminReg.js';
import adminAuthRoute from './routes/api/adminRoutes/authAdmin.js';
import adminActionRoute from './routes/api/adminRoutes/adminAction.js';

const app = express();

// Connect to data-base
connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false // Disable the `X-RateLimit-*` headers
  validate: {xForwardedForHeader: false}
});

//InitMiddleware for body parser to send/post request to the route
// Earlier to this, there used to be a package bodyParser,
// initialize and use it like : app.use(bodyParser.json({ extended: false }));
// but now included in express as below.
app.use(express.json({extended: false}));
app.use(limiter);

app.get('/', (req, res) => res.send('API Running'));

// Define Routes of user
app.use('/api/users', newUsersRoute);
app.use('/api/auth', userAuthRoute);
app.use('/api/accountInfo', userAccountInfoRoute);
app.use('/api/profile', profileRoute);
app.use('/api/transactions', transactionsRoute);

// Define Routes of admin
app.use('/api/admin', newAdminRoute);
app.use('/api/authAdmin', adminAuthRoute);
app.use('/api/adminAction', adminActionRoute);

const PORT = process.env.PORT || 5001; //5000 port is for Mac Airplay receiver

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
