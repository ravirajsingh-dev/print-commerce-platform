const default_templates = {
  "user-welcome-email": {
    subject: "Welcome to Shree Advertising",
    dynamic_parameters: "name,password,login_link",
    slug: "user-welcome-email",
    description:
      "<p>Dear {{name}}, </p><p>Your account has been created on Shree Advertising.</p><p>This is your login link: <a href='{{login_link}}'>{{login_link}}</a></p><p>Your default password is {{password}}</p><p>We recommend you to change the password after login.</p><p>Regards,<br />Shree Advertising Support Team</p>",
    status: 1,
  },
  "user-reset-password-email": {
    subject: "Password Reset Request",
    dynamic_parameters: "name,otp",
    slug: "user-reset-password-email",
    description:
      "<p>Dear {{name}},</p><p><strong> Do not share your One-Time Password (OTP) with anyone.</strong></p><p>You have requested for the password reset.Your One-Time Password (OTP) for password reset is <strong>{{otp}}</strong>.</p><p>If you have not requested the password reset kindly ignore.</p><p>Regards,<br />Shree Advertising Support Team</p>",
    status: 1,
  },
  "send-payment-alert-email": {
    subject: "Payment Request",
    dynamic_parameters:
      "name,senderName,senderH2C,amount,receiverName,receiverH2C",
    slug: "send-payment-alert-email",
    description:
      "<p>Dear {{name}},</p><br/><p><strong> A New Payment was received from {{senderName}}({{senderH2C}}) Of {{amount}} on {{receiverName}}({{receiverH2C}}) .</strong></p><p>Please Verify and accept this payment.",
    status: 1,
  },
};

module.exports = default_templates;
