import * as bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
	try {
		const hash = await bcrypt.hash(password, saltRounds);
		return hash;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw error;
	}
}

export async function comparePassword(
	password: string,
	hash: string
): Promise<boolean> {
	try {
		const ok = await bcrypt.compare(password, hash);
		return ok;
	} catch (error) {
		console.error("Error to compare the password");
		throw error;
	}
}
