const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
mongoose.set('useCreateIndex', true);

const connectDB = async () => {
  try {
    // Returns a promise, thats why we use await here.
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //Exit the process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
