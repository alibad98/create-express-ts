import { Request, Response } from "express";
import { Example } from "../models/example.model";

export async function getExamples(_req: Request, res: Response) {
  const docs = await Example.find();
  res.json(docs);
}

export async function createExample(req: Request, res: Response) {
  const doc = new Example(req.body);
  await doc.save();
  res.status(201).json(doc);
}
