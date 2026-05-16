import type { Request, Response } from 'express';
import express from 'express';
import CategoryDatabase from '../database/CategoryDatabase.js';
import CategoryModel from '../model/CategorySchema.js';
import type { CategoryRepository } from '../Repository/CategoryRepository.js';
import slugify from 'slugify';
import { CategoryData } from '../data/CategoryData.js';

const categoryRepo: CategoryRepository = new CategoryDatabase(CategoryModel);

const router = express.Router();

router.post('/insertcategories', async (_req: Request, res: Response) => {
  const data = CategoryData.map((category) => {
    const random = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    const name = `${category.name}-${random}`;
    return {
      ...category,
      name,
      slug: slugify(`${name}-${timestamp}-${random}`, {
        lower: true,
        strict: true,
      }),
    };
  });

  await categoryRepo.addManyCategories(data);
  res.send('inserted successfully');
});

router.delete('/deletecategories', async (_req: Request, res: Response) => {
  await categoryRepo.deleteAllCategories();
  res.send('deleted successfully');
});

router.delete('/deletecategoriesbyids', async (req: Request, res: Response) => {
  const ids = req.body.ids as string[];
  await categoryRepo.deleteManyCategories(ids);
  res.send('deleted successfully');
});

export default router;
