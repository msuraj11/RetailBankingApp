const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to data-base
connectDB();

//InitMiddleware for body parser to send/post request to the route
// Earlier to this, there used to be a package bodyParser,
// initialize and use it like : app.use(bodyParser.json({ extended: false }));
// but now included in express as below.
app.use(express.json({extended: false}));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
