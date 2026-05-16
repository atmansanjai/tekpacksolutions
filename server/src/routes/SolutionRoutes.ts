import type { Request, Response } from 'express';
import express from 'express';
import SolutionDatabase from '../database/SolutionDatabase.js';
import SolutionModel from '../model/SolutionSchema.js';
import type { SolutionRepository } from '../Repository/SolutionRepository.js';
import slugify from 'slugify';
import { SolutionData } from '../data/SolutionData.js';

const solutionRepo: SolutionRepository = new SolutionDatabase(SolutionModel);

const router = express.Router();

router.post('/insertsolutions', async (_req: Request, res: Response) => {
  const data = SolutionData.map((solution) => {
    const random = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    const name = `${solution.name}-${random}`;
    return {
      ...solution,
      name,
      slug: slugify(`${name}-${timestamp}-${random}`, {
        lower: true,
        strict: true,
      }),
    };
  });

  await solutionRepo.addManySolutions(data);
  res.send('inserted successfully');
});

router.delete('/deletesolutions', async (_req: Request, res: Response) => {
  await solutionRepo.deleteAllSolutions();
  res.send('deleted successfully');
});

router.delete('/deletesolutionbyids', async (req: Request, res: Response) => {
  const ids = req.body.ids as string[];
  await solutionRepo.deleteManySolutions(ids);
  res.send('deleted successfully');
});

export default router;
