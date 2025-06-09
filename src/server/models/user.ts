import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import bcrypt from "bcrypt";
import crypto from "crypto";



const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
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
  return crypto.randomBytes(32).toString("hex");
};

export default User;
