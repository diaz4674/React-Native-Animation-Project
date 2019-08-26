const twilio = require('twilio')

const accountSid = 'AC0e53ae12e722a8f686af402363e8edb4'
const authToken = 'e2a605e66eb956dfcb5a8084d6c2a8d7'

module.exports = new twilio.Twilio(accountSid, authToken)