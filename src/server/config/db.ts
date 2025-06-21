import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import pg from "pg";

const isProd = process.env.NODE_ENV === "production";

const sequelize = isProd
  ? new Sequelize(process.env.DATABASE_URL!, {
      dialect: "postgres",
      dialectModule: pg,
      protocol: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // needed for Render, Supabase, etc.
        },
      },
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
    await sequelize.sync({ alter: true });
    // if (!isProd) {
    //   await sequelize.sync({ alter: true });
    // } else {
    //   await sequelize.sync();
    // }
    console.log("✅ DB connected and synced");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}
