import validator from "validator";

export function isValidEmail(email) {
  return validator.isEmail(String(email || ""));
}

export function cleanText(v) {
  return String(v || "").trim();
}
