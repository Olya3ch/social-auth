import express, { Request, Response } from "express";
import { collections } from "../db";
import User from "../models/user";

import crypto from "crypto";
import bcrypt from "bcrypt";

export const userRouter = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const ifUserExists = await collections.users!.findOne({ email });
    if (ifUserExists)
      return res.status(401).json({ detail: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { email: email, password: hashedPassword } as User;
    const result = await collections.users!.updateOne(
      { email: email },
      { $setOnInsert: newUser },
      { upsert: true }
    );

    result
      ? res.status(201).send(`Succesfully created a new user with email ${email}`)
      : res.status(500).send("Failed to create a new user.");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await collections.users!.findOne({ email });

    if (!user) return res.status(401).json({ message: "Email not Registered" })

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ message: "Password is Wrong!" })

    res.status(201).send("You Are In!")

} catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
}
});

userRouter.get("/all", async (_req: Request, res: Response) => {
  try {
    const users = await collections.users!.find().toArray();

    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
});
