/**
 * One-off script: hash a password for use in the database (e.g. in Prisma Studio).
 * Usage: npx ts-node scripts/hash-password.ts [password]
 * If no password is given, defaults to "password123".
 * Copy the printed hash into the User.password field in Prisma Studio.
 */

import { hashPassword } from '../src/utils/bcrypt.util';

const password = process.argv[2] ?? 'password123';

hashPassword(password)
  .then((hash) => {
    console.log('Use this hash in User.password (e.g. in Prisma Studio):');
    console.log(hash);
    console.log('\nThen log in with password:', password);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
