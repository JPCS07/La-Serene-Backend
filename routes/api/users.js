const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

//@Route  POST api/users
//@desc   Register Route
//@access Private

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please Include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more character"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See If User Exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exists" }] });
      }

      //Get USer Gravatar

      const avatar = gravatar.url(email, {
        //Default Size
        s: "200",
        //Reading
        r: "pg",
        //Default
        d: "mm",
      });

      //Create an incestance of user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt The Password
      //Salt is random data nput to a one-way function that hashes data

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return JSON WEB TOKEN
      const payload = {
        user: {
          id: user.id,
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
