
import bcrypt from 'bcrypt';

async function main() {
    const password = 'IBY94$';
    const hash = await bcrypt.hash(password, 10);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
}

main();
