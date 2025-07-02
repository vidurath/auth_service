const config = require("../config/auth.config.js");
const db = require("../models");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const user = db.user;

const { logger } = require("../logging/logger");

exports.createuser = async (req, res) => {
  try {
    const { username, email, firstName, lastName, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, Email, and Password are required fields.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await user.create({
      username: username,
      email: email,
      firstName: firstName || null,
      lastName: lastName || null,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser.id,
      username: newUser.username,
    });

  } catch (error) {
    logger.error("Error creating user:", error);

    if (error.name === 'SequelizeUniqueConstraintError' ||
        (error.errors && error.errors[0] && error.errors[0].type === 'unique') ||
        error.message.includes('email must be unique') ||
        error.message.includes('username must be unique')) {
      return res.status(409).json({
        message: "User with this email or username already exists."
      });
    }

    res.status(500).json({ message: "An error occurred during user creation. Please try again later." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please provide both username and password." });
    }

    const foundUser = await user.findOne({ where: { username: username } });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const passwordIsValid = await bcrypt.compare(password, foundUser.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const tokenPayload = {
      id: foundUser.id,
      username: foundUser.username,
    };

    const token = jwt.sign(tokenPayload, config.secret, {
      expiresIn: config.expiresIn,
    });

    res.status(200).json({
      message: "Login successful!",
      token: token,
      userId: foundUser.id,
      username: foundUser.username,
    });

  } catch (error) {
    logger.error("Error during user login:", error);
    res.status(500).json({ message: "An internal server error occurred during login. Please try again later." });
  }
};