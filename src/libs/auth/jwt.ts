import jwt, { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
	userId: string;
	role: string;
}

const getSecretKey = () => process.env.JWT_SECRET || "your-very-secure-secret";

export const generateToken = (userId: string, role: string): string => {
	const payload: UserPayload = {
		userId,
		role,
	};

	const token = jwt.sign(payload, getSecretKey(), {
		expiresIn: "1d",
	});

	return token;
};

export const verifyToken = (token: string): UserPayload => {
	const payload = jwt.verify(token, getSecretKey()) as UserPayload;

	if (!payload.userId || !payload.role) {
		throw new Error("Invalid token payload");
	}

	return payload;
};
