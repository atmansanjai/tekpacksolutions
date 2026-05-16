import type { Request, Response } from 'express';
import express from 'express';
import MachineDatabase from '../database/MachineDatabase.js';
import MachineModel from '../model/MachineSchema.js';
import type { MachineRepository } from '../Repository/MachineRepository.js';
import slugify from 'slugify';
import { MachineData } from '../data/MachineData.js';

const machineRepo: MachineRepository = new MachineDatabase(MachineModel);

const router = express.Router();

router.post('/insertmachines', async (_req: Request, res: Response) => {
  const data = MachineData.map((machine) => {
    const random = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();

    const name = `${machine.name}-${random}`;

    return {
      ...machine,
      name,
      slug: slugify(`${name}-${timestamp}-${random}`, {
        lower: true,
        strict: true,
      }),
    };
  });

  console.log(data)
  await machineRepo.addManyMachines(data);
  res.send('inserted successfully');
});

router.delete('/deletemachines', async (_req: Request, res: Response) => {
  await machineRepo.deleteAllMachines();
  res.send('deleted successfully');
});

router.delete('/deletemachinebyids', async (req: Request, res: Response) => {
  const ids = req.body.ids as string[];
  await machineRepo.deleteManyMachines(ids);
  res.send('deleted successfully');
});

export default router;
