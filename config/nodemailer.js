const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport
({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PWD
  }
})

let recoveryText = `
  Passsord reset request
  Hi,
  Someone has requested a new password for your Mindflow account.
  If you didn't make this request, just ignore this email. If you'd like to proceed:
  Click here to reset your password <http://localhost:3000/recovery/reset-password>
  Thank you!`


module.exports = { transporter, recoveryText };