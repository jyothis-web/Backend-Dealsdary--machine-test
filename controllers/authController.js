const employermodel = require("../models/employerModel");
const { authSchema } = require("../helpers/validationSchema");
const jwt = require("jsonwebtoken");

// for register
const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validation
    if (!username) {
      return res.status(400).json({ mesage: "username is required" });
    }
    if (!password) {
      return res.status(400).json({ mesage: "Password is required" });
    }
    const result = await authSchema.validateAsync(req.body);
    console.log(result);

    // user checking
    const existingUser = await employermodel.findOne({ username });

    // existing user checking
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Already registered, please login",
      });
    }

    // save
    const user = new employermodel({ username, password });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    // return console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

//for login
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Find username
    const user = await employermodel.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "username is not registered",
      });
    }

    // Check password
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = await jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
};
