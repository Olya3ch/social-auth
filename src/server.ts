import express, { Application, Request, Response } from "express";
import { connectToDatabase } from "./db";
import { userRouter } from "./routes/userRouter";

const app: Application = express();

const port: number = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

connectToDatabase()
  .then(() => {
    // app.use("/user", userRouter);

    app.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    // tslint:disable-next-line:no-console
    console.error("Database connection failed", error);
    process.exit();
  });
