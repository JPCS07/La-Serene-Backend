//json has objectId payload we send token back to authenticate & access protected routes.
//to access custome routes we can make a custome middelware

const jwt = require("jsonwebtoken");
const config = require("config");

//Module contains req & res and callback next it moves to the next middleware

module.exports = function (req, res, next) {
  //HTTP Content-Type of the response response.setHeader(name, value)
  //Get token from header
  const token = req.header("x-auth-token");

  //Check If Not Token
  if (!token) {
    return res.status(401).json({ msg: "No Token Authorization Denied" });
  }

  //Verify Tocken
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
      res.status(401).json({ msg: 'Token Is Not Valid' });
  }
};
