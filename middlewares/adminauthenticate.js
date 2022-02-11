const jwt = require("jsonwebtoken");
const Admin = require("../models/Admins");

const adminauthenticate = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token);
    const verifyToken = await jwt.verify(token, process.env.SECRET);
    const rootUser = await Admin.findOne({ _id: verifyToken._id });
    if (!rootUser) {
      throw new Error("User not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized Admin");
    console.log(err);
  }
};
module.exports = adminauthenticate;
