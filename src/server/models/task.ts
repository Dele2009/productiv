import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  organizationId: { type: DataTypes.UUID, allowNull: false },
  departmentId: { type: DataTypes.UUID },
  ownerId: { type: DataTypes.UUID }, // User assigned to
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM("todo", "in_progress", "done"),
    defaultValue: "todo",
  },
  dueDate: DataTypes.DATE,
});

export default Task;