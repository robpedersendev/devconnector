const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// Bring in the JWT (Json web token)
const jwt = require("jsonwebtoken");
// Bring in the config/default.json file to use the JWT secret
const config = require("config");
// Utilize the middelware in middleware/auth.js
const auth = require("../../middleware/auth.js");
// Bring in the user model
const User = require("../../models/User");
//Import bcrypt
const bcrypt = require("bcryptjs");

//@Route    GET api/auth
//@Desc     test route
//@Access   Public route

// By using the "auth" variable here, this is now a protected route
router.get("/", auth, async (req, res) => {
  try {
    // We can access req.user because this is a protected route and every protected route has access to the decoded.user from the middleware.
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error, Routes/api/auth.js router.get");
  }
});

//@Route    POST api/auth
//@Desc     Authenticate existing users and provide token
//@Access   Public route
router.post(
  "/",
  // This is our middleware for the route
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  // Returns a Promise
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        //Create an error message here stating invalid credentials
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //We need to match the entered password and compare it to the encrypted password
      const isMatch = await bcrypt.compare(
        password /* Plain text password */,
        user.password /* Encrypted password */
      );

      if (!isMatch) {
        //Create an error message here stating invalid credentials
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

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
        config.get("jwtSecret"),
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
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
