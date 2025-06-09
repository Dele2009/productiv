import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    dialect: "mysql",
    dialectModule: mysql2,
    logging: false,
  }
);

export default sequelize;

export async function initDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("DB connected and synced ✅");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}
