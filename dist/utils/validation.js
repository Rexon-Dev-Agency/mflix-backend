// Input validation helpers
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPassword = (password) => typeof password === "string" && password.length >= 8;
//# sourceMappingURL=validation.js.map