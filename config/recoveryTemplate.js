module.exports = {
  recoveryTemplate: (firstName, userId) => { return `
  <p>Hi ${firstName},
  <br><br>Someone has requested a new password for your Mindflow account.
  <br><br>If you didn't make this request, just ignore this email. If you'd like to proceed:
  <br><a href="http://localhost:3000/recovery/reset-password/${userId}">Click here to reset your password</a>
  <br><br>Thank you!`
  }
}