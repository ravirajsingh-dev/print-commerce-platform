const nodemailer = require("nodemailer");
const default_templates = require("./defaultEmailTemplates");

const {
  APP_NAME,
  APP_API_URL,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME,
  MAIL_REPLY_TO,
} = require("../config/config");

const shootEmail = async (slug, input) => {
  input.app_name = APP_NAME;
  input.app_url = APP_API_URL;
  // $input.app_logo = asset("img/logo.png");
  input.copyright_year = new Date().getFullYear();

  slug = slug.toLowerCase().replace(/\s/g, "");

  template = default_templates[slug];
  console.log(
    "Template not found in database, picking from default templates",
    slug
  );
  if (!template) {
    console.log("Template", slug, "not found in default templates as well");
  }

  if (template) {
    let email_subject = template.subject;
    let email_body = template.description;
    let dynamic_parameters = template.dynamic_parameters;

    dynamic_parameters = dynamic_parameters.replace(/\s/g, "").split(",");
    dynamic_parameters.push("app_name");
    dynamic_parameters.push("app_url");
    // dynamic_parameteres.push('app_logo');
    dynamic_parameters.push("copyright_year");
    dynamic_parameters.push("link");

    dynamic_parameters.forEach((value) => {
      var replace_string = new RegExp("{{" + value + "}}", "g");
      if (!input[value]) {
        input[value] = "-";
      }

      email_subject = email_subject.replace(replace_string, input[value]);
      email_body = email_body.replace(replace_string, input[value]);
    });

    var transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });
    var mailOptions = {
      from: MAIL_FROM_NAME + "<" + MAIL_FROM_ADDRESS + ">",
      to: input.email,
      subject: email_subject,
      html: email_body,
      replyTo: MAIL_REPLY_TO,
    };

    if (input.attachments) {
      mailOptions.attachments = input.attachments;
    }
    const trans = await transporter.sendMail(mailOptions);
    return true;
  } else {
    console.log("Not sending any mail, template not found");
    return false;
  }
};

const initEmail = async (emailSlug, input) => {
  return new Promise((resolve, reject) => {
    if (!input.email) {
      console.log("email is required to send an email");
      reject(400);
    }

    shootEmail(emailSlug, input)
      .then((success) => {
        if (success) {
          console.log(`The email ${emailSlug} has been sent.`);
          resolve(true);
        } else {
          console.log(
            "We are unable to send the email right now. Please, try again later"
          );
        }
        reject(400);
      })
      .catch((err) => {
        console.log(
          "We are unable to send the email right now. Please, try again later"
        );
        reject(500);
      });
  });
};

module.exports = initEmail;
