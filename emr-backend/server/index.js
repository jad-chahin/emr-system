const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const twilioClient = require('./controllers/twillio.js')
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('./db');

const { Patient, Medicine } = require("./models/Patient");
const Appointment = require("./models/Appointment");
//const Medicine = require('./models/Condition');

const UserRouter = require("./routes/user.js");
const PatientAuthRouter = require("./routes/patient.js");
const { authenticate, requireRole } = require("./middleware/auth.js");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(morgan('dev'));
const corsOptions = {
    origin: ["https://emr-application-5i8r.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use("/user", UserRouter);
app.use("/patient", PatientAuthRouter);

// Create a new patient
app.post("/patients", authenticate, requireRole(["doctor"]), async (req, res, next) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).send(newPatient);
    } catch (error) {
        next(error);
    }
});

// Read all patients
app.get("/patients", authenticate, requireRole(["doctor"]), async (req, res, next) => {
    try {
        const patients = await Patient.find();
        res.status(200).send(patients);
    } catch (error) {
        next(error);
    }
});

// Read a single patient by ID
app.get("/patients/:id", authenticate, async (req, res, next) => {
    try {
        if (req.user?.role === "patient" && req.user?.id !== req.params.id) {
            return res.status(403).send({ message: "Forbidden" });
        }
        const patient = await Patient.findById(req.params.id)
        .populate("treatments");
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        res.status(200).send(patient);
    } catch (error) {
        next(error);
    }
});

// Update a patient by ID
app.put("/patients/:id", authenticate, async (req, res, next) => {
    try {
        if (req.user?.role === "patient") {
            if (req.user?.id !== req.params.id) {
                return res.status(403).send({ message: "Forbidden" });
            }
            const keys = Object.keys(req.body || {});
            const allowed = ["contactPreference"];
            const isAllowed = keys.every((key) => allowed.includes(key));
            if (!isAllowed) {
                return res.status(403).send({ message: "Forbidden" });
            }
        }
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedPatient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        res.status(200).send(updatedPatient);
    } catch (error) {
        next(error);
    }
});

// Delete a patient by ID
app.delete("/patients/:id", authenticate, requireRole(["doctor"]), async (req, res, next) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        res.status(200).send(deletedPatient);
    } catch (error) {
        next(error);
    }
});

// Add an appointment
app.post("/appointments", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        let patient = null;
        let patientName = req.body.patientName || '';
        let patientCardNumber = req.body.patientCardNumber || '';

        if (req.body.patient || req.body.patientId) {
            patient = await Patient.findById(req.body.patient || req.body.patientId);
        } else if (req.body.patientDeats) {
            let a = req.body.patientDeats;
            let fn = a.substring(0, a.indexOf(" "));
            let ln = a.substring(a.indexOf(" ") + 1, a.indexOf(","));
            let cn = a.substring(a.lastIndexOf(" ") + 1);
            patient = await Patient.findOne({ firstName: fn, lastName: ln, cardNumber: cn });
            patientName = patientName || `${fn} ${ln}`.trim();
            patientCardNumber = patientCardNumber || cn;
        }

        if (!patient) {
            return res.status(400).send({ message: "Patient not found for appointment" });
        }

        let appointment = new Appointment({
            patient: patient._id,
            patientName: patientName || `${patient.firstName} ${patient.lastName}`.trim(),
            patientCardNumber: patientCardNumber || patient.cardNumber,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            notes: req.body.notes
        });
        console.log(appointment)
        await appointment.save();
        res.send(appointment);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Gets all appointments
app.get('/calendar/appointments', authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const appointments = await Appointment.find({ date: req.query.date }).populate('patient');
        res.status(200).send(appointments);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/appointments', authenticate, async (req, res) => {
    try {
        const filter = req.user?.role === "patient" ? { patient: req.user.id } : {};
        const appointments = await Appointment.find(filter);
        res.status(200).send(appointments)
    } catch (error) {
        res.status(500).send({ message : error.message})
    }
})

// Get a single appointment by id
app.get("/appointments/:id", authenticate, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).send({ message: "Appointment not found" });
        }
        if (req.user?.role === "patient" && String(appointment.patient) !== req.user?.id) {
            return res.status(403).send({ message: "Forbidden" });
        }
        res.status(200).send(appointment);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update an appointment by id
app.put("/appointments/:id", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAppointment) {
            return res.status(404).send({ message: "Appointment not found" });
        }
        res.status(200).send(updatedAppointment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Remove an appointment by id
app.delete("/appointments/:id", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) {
            return res.status(404).send({ message: "Appointment not found" });
        }
        res.status(200).send(deletedAppointment);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// delete an appointment 
app.delete("/appointments/patient/:patientId", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const result = await Appointment.deleteMany({ patient: req.params.patientId });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "No appointments found for this patient to delete" });
        }
        res.status(200).send({ message: "Appointments deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        message: err.message || 'Internal Server Error'
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Create a new treatment
app.post("/treatments", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const newTreatment = new Medicine(req.body);
        await newTreatment.save();
        res.status(201).send(newTreatment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Get all treatments
app.get("/treatments", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const treatments = await Medicine.find();
        res.status(200).send(treatments);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get treatment by ID
app.get("/treatments/:id", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const treatment = await Medicine.findById(req.params.id);
        if (!treatment) {
            return res.status(404).send({ message: "Treatment not found" });
        }
        res.status(200).send(treatment);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update a treatment by ID
app.put("/treatments/:id", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const updatedTreatment = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTreatment) {
            return res.status(404).send({ message: "Treatment not found" });
        }
        res.status(200).send(updatedTreatment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Delete a treatment by ID
app.delete("/treatments/:id", authenticate, requireRole(["doctor"]), async (req, res) => {
    try {
        const deletedTreatment = await Medicine.findByIdAndDelete(req.params.id);
        if (!deletedTreatment) {
            return res.status(404).send({ message: "Treatment not found" });
        }
        res.status(200).send(deletedTreatment);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// twillio notifications

async function sendSMS(to, message) {
    if (!twilioClient) {
        throw new Error("Twilio is not configured.");
    }
    const from = process.env.TWILIO_FROM;
    if (!from) {
        throw new Error('Missing "TWILIO_FROM".');
    }
    const response = await twilioClient.messages.create({
        body: message,
        to: to,  // Text this number
        from: from // From a valid Twilio number
    });
    console.log('SMS sent successfully!', response.sid);
}

app.post('/send-sms', authenticate, requireRole(["doctor"]), async (req, res) => {
    const { to, message } = req.body;
    try {
        if (!to || !message) {
            return res.status(400).send({ message: 'Missing "to" or "message".' });
        }
        if (!twilioClient || !process.env.TWILIO_FROM) {
            return res.status(500).send({ message: 'Twilio is not configured.' });
        }
        await sendSMS(to, message);
        res.status(200).send({ message: 'SMS sent successfully!' });
    } catch (error) {
        console.error('Failed to send SMS.', error);
        res.status(500).send({ message: error.message });
    }
});

// node mailer and node cron

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(to, subject, text) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email service is not configured.");
    }
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('email sent successfully', info.response);
        return info;
    } catch (error) {
        console.error('Failed to send email', error);
        throw error;
    }
}

app.post('/send-email', authenticate, requireRole(["doctor"]), async (req, res) => {
    const { to, subject, text } = req.body
    try {
        if (!to || !subject || !text) {
            return res.status(400).send({ message: 'Missing "to", "subject", or "text".' });
        }
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).send({ message: 'Email service is not configured.' });
        }
        await sendEmail(to, subject, text)
        res.status(200).send({ message: 'Email sent successfully!' })
    } catch (e) {
        console.error('Failed to send email', e);
        res.status(500).send({ message: e.message })
    }
})

cron.schedule('0 3 * * *', async () => { // runs at 3 am every day
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return;
        }
        let date = (new Date()).toLocaleDateString()
        const appointments = await Appointment.find({ date: date }).populate('patient');

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: '',
            subject: 'Appointment Reminder!',
            text: 'Your Appointment is scheduled for today.\nRegards,\nEMR Team'
        }

        appointments.forEach(async a => {
            if (!a.patient || !a.patient.contact || !a.patient.contact.email) {
                return;
            }
            mailOptions.to = a.patient.contact.email
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully: ' + info.response);
            } catch (error) {
                console.log('Error occurred: ' + error.message);
            }
        })
    } catch(e) {
        console.error(e)
    }
}, {
    scheduled: true,
    timezone: "America/New_York" // Set the desired timezone
});
