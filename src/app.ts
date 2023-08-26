import express, { Express } from "express";
import photoRoute from "./routes/photo";
import fileUpload from "express-fileupload";
import { config } from "dotenv";
import cors from "cors";
config();
import { dbConnection } from "./db/db";

const PORT = process.env.MODE === "prod" ? process.env.PORT : 3000;

const app: Express = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    uploadTimeout: 50000,
    // limitHandler:
  })
);

// Routes
app.use("/photos", photoRoute);

dbConnection.on("connected", () => {
  console.log(`DB Connection successfull`);

  app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
  });
});
