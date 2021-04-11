const express = require('express');
const router = express.Router();

// Utilize the middelware in middleware/auth.js
const auth = require('../../middleware/auth.js');

// Bring in the user model
const User = require('../../models/User');

//@Route    GET api/auth
//@Desc     test route
//@Access   Public route

// By using the "auth" variable here, this is now a protected route
router.get('/', auth, async (req, res) => {
  try {
    // We can access req.user because this is a protected route and every protected route has access to the decoded.user from the middleware.
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, Routes/api/auth.js router.get');
  }
});

module.exports = router;
