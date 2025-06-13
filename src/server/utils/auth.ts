import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export function signToken(data: Record<string, string>, expiresIn: SignOptions["expiresIn"] = "7d") {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn,
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
export function getUserFromToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return { id: decoded.id, email: decoded.email };
}