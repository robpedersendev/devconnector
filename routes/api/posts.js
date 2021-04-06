const express = require('express');
const router = express.Router();

//@Route    GET api/posts
//@Desc     test route
//@Access   Public route
router.get('/', (req,res) => res.send('Posts Route'))

module.exports = router;