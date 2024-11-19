const express = require('express');
const {rateLimit} = require('express-rate-limit');
const connectDB = require('./config/db');

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
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/accountInfo', require('./routes/api/accountInfo'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/transactions', require('./routes/api/transactions'));

// Define Routes of admin
app.use('/api/admin', require('./routes/api/adminRoutes/adminReg'));
app.use('/api/authAdmin', require('./routes/api/adminRoutes/authAdmin'));
app.use('/api/adminAction', require('./routes/api/adminRoutes/adminAction'));

const PORT = process.env.PORT || 5001; //5000 port is for Mac Airplay receiver

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
