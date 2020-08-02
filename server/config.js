module.exports = {
  twilio: {
    accountSid: process.env.ACCOUNT_SID,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    chatService: process.env.TWILIO_CHAT_SERVICE_SID,
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: process.env.TWILIO_ALLOW_INCOMING_CALLS === "true"
  }
};