const express = require('express');
const router = express.Router();

//@Route  Get api/Posts
//@desc   Test Route
//@access Private
router.get('/' , (req, res) => res.send('Posts Route'));

module.exports = router;