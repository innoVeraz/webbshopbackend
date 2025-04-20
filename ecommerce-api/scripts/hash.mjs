import bcrypt from 'bcryptjs';
const hashed = await bcrypt.hash('admin123', 10);
console.log(hashed);