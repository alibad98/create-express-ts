import { Router } from 'express';
import { getExamples, createExample } from '../controllers/example.controller';

export const exampleRoute = Router();

exampleRoute.get('/', getExamples);
exampleRoute.post('/', createExample);
