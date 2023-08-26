import { NextFunction, Request, Response } from "express";

export const limitHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`limit reached`);
  res.send("bokkale");
};
