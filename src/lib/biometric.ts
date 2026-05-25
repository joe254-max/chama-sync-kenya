// Lightweight biometric "quick unlock" using WebAuthn platform authenticator.
// NOTE: This is a UX gate — the session token is stored in localStorage and
// only restored after a successful WebAuthn assertion. It is not cryptographic
// encryption of the token. Good enough for app-open convenience; pair with
// short server-side session lifetimes.

const CRED_KEY = "mchama.bio.credId";
const SESSION_KEY = "mchama.bio.session";
const FAIL_KEY = "mchama.bio.fails";
const LAST_AUTH_KEY = "mchama.bio.lastAuth";
const MAX_FAILS = 3;
const REAUTH_AFTER_MS = 8 * 60 * 60 * 1000; // 8 hours

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    if (typeof window === "undefined" || !window.PublicKeyCredential) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export function hasBiometricEnrolled(): boolean {
  return !!localStorage.getItem(CRED_KEY) && !!localStorage.getItem(SESSION_KEY);
}

function randomBytes(len = 32) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return arr;
}

export async function enrollBiometric(opts: {
  userId: string;
  userName: string;
  session: { access_token: string; refresh_token: string };
}) {
  const cred = (await navigator.credentials.create({
    publicKey: {
      challenge: randomBytes(),
      rp: { name: "M-Chama" },
      user: {
        id: new TextEncoder().encode(opts.userId),
        name: opts.userName,
        displayName: opts.userName,
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("Biometric enrollment cancelled");
  const credIdB64 = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
  localStorage.setItem(CRED_KEY, credIdB64);
  localStorage.setItem(SESSION_KEY, JSON.stringify(opts.session));
  localStorage.setItem(LAST_AUTH_KEY, Date.now().toString());
  localStorage.removeItem(FAIL_KEY);
}

export async function verifyBiometric(): Promise<{ access_token: string; refresh_token: string } | null> {
  const credIdB64 = localStorage.getItem(CRED_KEY);
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!credIdB64 || !sessionStr) return null;
  const rawId = Uint8Array.from(atob(credIdB64), (c) => c.charCodeAt(0));
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(),
        allowCredentials: [{ id: rawId, type: "public-key" }],
        userVerification: "required",
        timeout: 60000,
      },
    });
    if (!assertion) throw new Error("No assertion");
    localStorage.removeItem(FAIL_KEY);
    localStorage.setItem(LAST_AUTH_KEY, Date.now().toString());
    return JSON.parse(sessionStr);
  } catch (e) {
    const fails = Number(localStorage.getItem(FAIL_KEY) ?? "0") + 1;
    localStorage.setItem(FAIL_KEY, String(fails));
    if (fails >= MAX_FAILS) disableBiometric();
    throw e;
  }
}

export function disableBiometric() {
  localStorage.removeItem(CRED_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(FAIL_KEY);
  localStorage.removeItem(LAST_AUTH_KEY);
}

export function needsReauth(): boolean {
  const last = Number(localStorage.getItem(LAST_AUTH_KEY) ?? "0");
  return Date.now() - last > REAUTH_AFTER_MS;
}

export function biometricFailCount(): number {
  return Number(localStorage.getItem(FAIL_KEY) ?? "0");
}
