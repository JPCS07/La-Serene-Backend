const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../../middelware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private

router.get("/admin", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

router.post(
  "/",
  [
    auth,
    [
      check("executive", "Field is required").not().isEmpty(),
      check("superiorKing", "Field is required").not().isEmpty(),
      check("superiorQueen", "Field is required").not().isEmpty(),
      check("king", "Field is required").not().isEmpty(),
      check("queen", "Field is required").not().isEmpty(),
      check("deluxe", "Field is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { executive, superiorKing, superiorQueen, king, queen, deluxe } =
      req.body;

    // Build Rooms Availibility Object
    const roomFields = {};
    roomFields.user = req.user.id;
    if (executive) roomFields.executive = executive;
    if (superiorKing) roomFields.superiorKing = superiorKing;
    if (superiorQueen) roomFields.superiorQueen = superiorQueen;
    if (king) roomFields.king = king;
    if (queen) roomFields.queen = queen;
    if (deluxe) roomFields.deluxe = deluxe;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if(profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: roomFields },
          { new: true}
        )
         return res.json(profile);
      } 
     //Create
     profile = new Profile(roomFields);
 
     await profile.save();

     res.json(profile);

    } catch (err) {
      console.error(err.message);
      re.status(500).send("SERVER ERROR");
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/' , async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server Error')
  }
})

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id' , async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error')
  }
})

module.exports = router;
