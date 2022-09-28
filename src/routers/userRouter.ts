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
    const accessToken = crypto.randomBytes(30).toString("hex");

    const newUser = { email: email, password: hashedPassword } as User;
    const result = await collections.users!.updateOne(
      { email: email },
      { $setOnInsert: newUser },
      { upsert: true }
    );

    result
      ? res.status(201).send({ accessToken: accessToken })
      : res.status(500).send("Failed to create a new user.");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
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
