import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifySid) {
  throw new Error("Variáveis de ambiente do Twilio não definidas.");
}

const client = twilio(accountSid, authToken);

export const sendVerificationCode = async (phoneNumber: string) => {
  return client.verify.v2.services(verifySid)
    .verifications
    .create({ to: phoneNumber, channel: 'sms' });
};

export const checkVerificationCode = async (phoneNumber: string, code: string) => {
  const verificationCheck = await client.verify.v2.services(verifySid)
    .verificationChecks
    .create({ to: phoneNumber, code });

  return verificationCheck.status === 'approved';
};
