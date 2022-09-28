import express, { Application, Request, Response } from "express";
import { connectToDatabase } from "./db";
import { userRouter } from "./routers/userRouter";

const app: Application = express();

const port: number = 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

connectToDatabase()
  .then(() => {
    app.use("/user", userRouter);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
