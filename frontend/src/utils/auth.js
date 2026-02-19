const KEY = "cyberraksha_token";
const USER_KEY = "cyberraksha_user";

export function setAuth(token, user) {
  localStorage.setItem(KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER_KEY);
}
