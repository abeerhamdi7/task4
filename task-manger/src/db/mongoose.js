const mongoose = require('mongoose');
// 1 connection to DB
mongoose.connect(process.env.MONGO_URL);
