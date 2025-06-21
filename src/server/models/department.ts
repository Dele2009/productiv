import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Department = sequelize.define("Department", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("active", "inactive" , "suspended") },
});

export default Department;