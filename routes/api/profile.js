const express = require('express');
const router = express.Router();

//@Route    GET api/profile
//@Desc     test route
//@Access   Public route
router.get('/', (req,res) => res.send('Profile Route'))

module.exports = router;