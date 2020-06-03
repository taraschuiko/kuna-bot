const crypto = require("crypto");

const publicKey = process.env.PUBLIC_KEY
const secretKey = process.env.SECRET_KEY

const getSignedHeaders = (apiPath, body) => {
  apiPath = `/v3${apiPath}`
  const nonce = new Date().getTime();
  const signatureString = `${apiPath}${nonce}${JSON.stringify(body)}`;
  const signature = crypto
      .createHmac("sha384", secretKey)
      .update(signatureString)
      .digest("hex");

  return {
    Accept: "application/json",
    "kun-nonce": nonce,
    "kun-apikey": publicKey,
    "kun-signature": signature
  }
}

module.exports = getSignedHeaders
