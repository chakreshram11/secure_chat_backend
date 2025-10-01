// utils/keyStorage.js

// Save ECDH private key persistently
export async function saveLocalPrivateKey(privateKey) {
  const raw = await crypto.subtle.exportKey("pkcs8", privateKey);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  localStorage.setItem("ecdhPrivateKey", b64);
}

// Load existing key
export function loadLocalPrivateKey() {
  const b64 = localStorage.getItem("ecdhPrivateKey");
  if (!b64) return null;

  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
  return crypto.subtle.importKey(
    "pkcs8",
    raw,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
}
