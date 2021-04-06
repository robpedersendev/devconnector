const express = require('express');
const router = express.Router();

//@Route    GET api/auth
//@Desc     test route
//@Access   Public route
router.get('/', (req,res) => res.send('Auth Route'))

module.exports = router;