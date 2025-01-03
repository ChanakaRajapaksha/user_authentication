const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Twilio Auth Token
const senderPhone = process.env.TWILIO_PHONE_NUMBER; // Twilio Phone Number

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
    if (!to) {
        console.error("Missing recipient phone number (to):", to);
        return {
            success: false,
            error: "Recipient phone number is missing or invalid.",
        };
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: senderPhone,
            to,
        });
        console.log("SMS sent successfully:", result.sid);
        return {
            success: true,
            sid: result.sid,
            status: result.status,
        };
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            to,
            body: message,
            from: senderPhone,
        });
        return {
            success: false,
            error: error.message,
        };
    }
};

module.exports = sendSMS;