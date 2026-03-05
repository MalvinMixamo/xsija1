import mysql from "mysql2/promise"
import fs from "fs";
import path from "path";


const certPath = path.join(process.cwd(), "isrgrootx1.pem")
export const db = mysql.createPool({
  host: process.env.DATABASE_URL,
  user: process.env.DB_USER,
  // port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
    ca: process.env.DB_CA,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});