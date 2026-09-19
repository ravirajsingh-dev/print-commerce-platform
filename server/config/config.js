// To setup a env variable it must be defined in docker-compose.yml and it's value must be assigned in .env file

const required = {
  APP_API_URL: 1,
  APP_PORTAL_URL: 1,
  APP_ENV: 1,
  APP_API_PORT: 1,
  APP_NAME: 1,

  MAIL_HOST: 1,
  MAIL_PORT: 1,
  MAIL_USERNAME: 1,
  MAIL_PASSWORD: 1,
  MAIL_FROM_ADDRESS: 1,
  MAIL_FROM_NAME: 1,
  MAIL_REPLY_TO: 1,

  MONGO_URI: 1,
  JWT_SECRET: 1,

  VERIFY_SERVICE_SID: 1,
  TWILIO_ACCOUNT_SID: 1,
  TWILIO_AUTH_TOKEN: 1,
  TWILIO_PHONE_NUMBER: 1,

  AWS_REGION: 1,
  AWS_ACCESSKEY: 1,
  AWS_SECRETACCESSKEY: 1,
  AWS_BUCKET_NAME: 1,

  CLOUDINARY_CLOUD_NAME: 1,
  CLOUDINARY_API_KEY: 1,
  CLOUDINARY_API_SECRET: 1,
};
let error = false;
for (let i in required) {
  if (!process.env[i]) {
    error = true;
    console.error(
      `ERROR: ${i} variable is not defined. Please define it in .env file`
    );
  }
}
if (error) return process.exit(1);

module.exports = {
  APP_API_URL: process.env.APP_API_URL,
  APP_PORTAL_URL: process.env.APP_PORTAL_URL,
  APP_ENV: process.env.APP_ENV,
  APP_API_PORT: process.env.APP_API_PORT,
  APP_NAME: process.env.APP_NAME,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
  MAIL_REPLY_TO: process.env.MAIL_REPLY_TO,

  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,

  VERIFY_SERVICE_SID: process.env.VERIFY_SERVICE_SID,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESSKEY: process.env.AWS_ACCESSKEY,
  AWS_SECRETACCESSKEY: process.env.AWS_SECRETACCESSKEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
