import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const UserMembership = sequelize.define(
  "UserMembership",
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "UserMembership",
    timestamps: false,
  }
);

export default UserMembership;
