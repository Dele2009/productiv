import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import { generateSlug } from "../utils/helpers";

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    size: {
      type: DataTypes.ENUM("small", "medium", "large"),
      allowNull: false,
    },
    type: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    industry: { type: DataTypes.STRING, allowNull: false },
    slug: DataTypes.STRING,
    passcode: { type: DataTypes.STRING, allowNull: true },
    logoUrl: { type: DataTypes.STRING, allowNull: true },
    adminId: {
      type: DataTypes.UUID,
    },
  },
  {
    hooks: {
      beforeCreate: (org: any) => {
        org.slug = generateSlug(org.name);
      },
    },
  }
);

export default Organization;
