import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING, // hashed
    role: {
      type: DataTypes.ENUM("admin", "member"),
      defaultValue: "member",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    organizationId: {
      type: DataTypes.UUID,
    },
  },
  {
    tableName: "users",
    hooks: {
      beforeCreate: async (user: any) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

// Add instance method to generate verification token

(User as any).prototype.generateVerificationToken = function () {
  const token = jwt.sign(
    { id: this.id, email: this.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
  return token;
};

export default User;
