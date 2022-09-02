import express, { Request, Response } from "express";
import { collections } from "../db";
import User from "../models/user";

export const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/user", async (req: Request, res: Response) => {
  try {
    const newUser = {email: "test@gmail.com", password: "12345"} as User;
    const result = await collections.users!.insertOne(newUser);

    result
      ? res
          .status(201)
          .send(`Successfully created a new user with id ${result.insertedId}`)
      : res.status(500).send("Failed to create a new user.");
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
});

// userRouter.get("/", async (_req: Request, res: Response) => {
//   try {
//     const users = (await collections.users.find({}).toArray()) as User[];

//     res.status(200).send(users);
//   } catch (error) {
//     // tslint:disable-next-line:no-console
//     console.error(error);
//     if (error instanceof Error) {
//       res.status(400).send(error.message);
//     }
//   }
// });
