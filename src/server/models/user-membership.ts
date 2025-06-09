import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const UserMembership = sequelize.define("Membership", {
  userId: { type: DataTypes.UUID, allowNull: false },
  departmentId: { type: DataTypes.UUID, allowNull: false },
});

export default UserMembership;