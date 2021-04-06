const express = require('express');
const router = express.Router();

//@Route    GET api/users
//@Desc     test route
//@Access   Public route
router.get('/', (req,res) => res.send('User Route'))

module.exports = router;