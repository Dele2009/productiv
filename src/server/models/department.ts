import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Department = sequelize.define("Department", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: { type: DataTypes.STRING, allowNull: false },
});

export default Department;