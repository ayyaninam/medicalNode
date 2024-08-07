const twilio = require('twilio');

const sendAccessCode = (phoneNumber, accessCode) => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILI0_AUTH_TOKEN);
    client.messages.create({
        body: `Your access code is ${accessCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });
};

module.exports = { sendAccessCode };