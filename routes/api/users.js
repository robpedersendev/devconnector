const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import the user model
const User = require('../../models/User');

//Bring in the gravatar package
const gravatar = require('gravatar');

// Bring in Bcrypt
const bcrypt = require('bcryptjs');

//@Route    POST api/users
//@Desc     Register new users
//@Access   Public route
router.post(
  '/',
  // This is our middleware for the route
  [
    check('name', 'Name Is Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  // Returns a Promise
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        //Create an error message here similar to how the package above returns an error message
        res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // Create the user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt the password
      //Create the Salt
      const salt = await bcrypt.genSalt(10);
      //Replace the password
      user.password = await bcrypt.hash(password, salt);
      //Save the user to the DB
      await user.save();

      // Return the Jsonwebtoken
      res.send('User Route');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
