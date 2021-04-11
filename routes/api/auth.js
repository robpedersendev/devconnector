const express = require('express');
const router = express.Router();

// Utilize the middelware in middleware/auth.js
const auth = require('../../middleware/auth.js');

//@Route    GET api/auth
//@Desc     test route
//@Access   Public route

// By using the "auth" variable here, this is now a protected route
router.get('/', auth, (req, res) => res.send('Auth Route'));

module.exports = router;
