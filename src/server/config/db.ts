import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize(process.env.DATABASE_URL!, {
        dialect: "postgres",
        logging: false,
      })
    : new Sequelize(
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
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true }); // Use migrations in production instead!
    }
    console.log("DB connected and synced ✅");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}
