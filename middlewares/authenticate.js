const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const verifyToken = await jwt.verify(token, process.env.SECRET);
    const rootUser = await Users.findOne({ _id: verifyToken._id });
    if (!rootUser) {
      throw new Error("User not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    console.log(req.rootUser);
    next();
  } catch (err) {
    res.status(401).send("Unauthorized user");
    console.log(err);
  }
};
module.exports = authenticate;
