const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModal = require("../models/User.js");

const secret = 'test';

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Hi");
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const role = oldUser.role || "doctor";
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id, role }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signup = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  try {
    console.log("Hi");
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    if (role && !["doctor", "patient"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      role: role || "doctor",
    });

    const token = jwt.sign(
      { email: result.email, id: result._id, role: result.role || "doctor" },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};

const getMe = async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await UserModal.findById(decoded?.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { signin, signup, getMe };
