import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
// Hash a password
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}
// Compare passwords
export async function comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
//# sourceMappingURL=passwordHashing.js.map