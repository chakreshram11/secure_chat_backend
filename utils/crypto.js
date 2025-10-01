// Utility to convert between formats used by front-end Web Crypto and Node
const crypto = require('crypto');

function base64ToBuffer(b64) {
  return Buffer.from(b64, 'base64');
}
function bufferToBase64(buf) {
  return Buffer.from(buf).toString('base64');
}

// Derive AES key from shared secret using HKDF (SHA-256)
function deriveAesKeyFromSharedSecret(sharedSecret, salt = null) {
  // sharedSecret: Buffer
  // returns 32 byte AES key Buffer
  const info = Buffer.from('chat-app-aes-key-derivation');
  const key = crypto.hkdfSync('sha256', sharedSecret, salt, info, 32);
  return key;
}

module.exports = { base64ToBuffer, bufferToBase64, deriveAesKeyFromSharedSecret };
