const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Bring in the JWT (Json web token)
const jwt = require('jsonwebtoken');
// Bring in the config/default.json file to use the JWT secret
const config = require('config');

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
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
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

      const payload = {
        user: {
          // Since we are using mongoose, we do not need to use the "._" to refer to the user that Mongodb uses. This is an abstraction.
          id: user.id,
        },
      };

      // Sign the token
      jwt.sign(
        // Pass in the payload
        payload,
        // Pass in the secret
        config.get('jwtSecret'),
        // Set an expiration
        { expiresIn: 3600000 }, // Change this to 3600 for 1 hour for prod
        (err, token) => {
          // If there is an error, throw an error
          if (err) throw err;
          // If not, return the token to the client
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
