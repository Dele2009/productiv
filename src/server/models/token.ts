import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Token = sequelize.define(
  "Token",
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("email_verification", "password_reset"),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
  }
);

export default Token;
