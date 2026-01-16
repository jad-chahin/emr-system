const jwt = require("jsonwebtoken");

const { Patient } = require("../models/Patient");

const secret = "test";

const signin = async (req, res) => {
  const { firstName, lastName, cardNumber } = req.body;

  if (!firstName || !lastName || !cardNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const patient = await Patient.findOne({
      firstName: new RegExp(`^${firstName.trim()}$`, "i"),
      lastName: new RegExp(`^${lastName.trim()}$`, "i"),
      cardNumber: new RegExp(`^${cardNumber.trim()}$`, "i"),
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const result = {
      _id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      cardNumber: patient.cardNumber,
      role: "patient",
    };

    const token = jwt.sign({ id: patient._id, role: "patient" }, secret, { expiresIn: "1h" });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signin };
