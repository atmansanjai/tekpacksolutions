import type { Request, Response } from 'express';
import express from 'express';
import SectorDatabase from '../database/SectorDatabase.js';
import SectorModel from '../model/SectorSchema.js';
import type { SectorRepository } from '../Repository/SectorRepository.js';
import slugify from 'slugify';
import { SectorData } from '../data/SectorData.js';

const sectorRepo: SectorRepository = new SectorDatabase(SectorModel);

const router = express.Router();

router.post('/insertsectors', async (_req: Request, res: Response) => {
  const data = SectorData.map((sector) => {
    const random = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    const name = `${sector.name}-${random}`;
    return {
      ...sector,
      name,
      slug: slugify(`${name}-${timestamp}-${random}`, {
        lower: true,
        strict: true,
      }),
    };
  });
  await sectorRepo.addManySectors(data);
  res.send('inserted successfully');
});

router.delete('/deletesectors', async (_req: Request, res: Response) => {
  await sectorRepo.deleteAllSectors();
  res.send('deleted successfully');
});

router.delete('/deletesectorbyids', async (req: Request, res: Response) => {
  const ids = req.body.ids as string[];
  await sectorRepo.deleteManySectors(ids);
  res.send('deleted successfully');
});

export default router;
