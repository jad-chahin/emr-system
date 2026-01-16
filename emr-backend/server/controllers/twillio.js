const twilio = require('twilio');
const dotenv = require('dotenv')

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.AUTH_TOKEN;

let client = null;
if (accountSid && authToken) {
  client = new twilio(accountSid, authToken);
}

module.exports = client;
