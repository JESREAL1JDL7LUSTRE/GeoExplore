const AUTH_TOKEN_KEY = "authToken";
const AUTH_EXPIRY_KEY = "authExpiry";

export const VALID_TOKEN =
  process.env.NEXT_PUBLIC_AUTH_TOKEN ?? "geoexplore-demo-token";

export function loginWithToken(token: string) {
  if (typeof window === "undefined") return false;
  if (token.trim().length === 0) return false;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_EXPIRY_KEY, String(Date.now() + 3_600_000));
  return true;
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;

  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const expiry = Number(window.localStorage.getItem(AUTH_EXPIRY_KEY));

  const valid = Boolean(token) && Number.isFinite(expiry) && Date.now() < expiry;

  if (!valid) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_EXPIRY_KEY);
  }

  return valid;
}

export function logout() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_EXPIRY_KEY);
}
