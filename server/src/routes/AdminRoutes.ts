import express from 'express';
import AdminDatabase from '../database/AdminDatabase.js';
import AdminModel from '../model/AdminSchema.js';
import type { AdminRepository } from '../Repository/AdminRepository.js';
import { MockAdminData } from '../data/AdminData.js';
import slugify from 'slugify';
import type { Request, Response } from 'express';

const adminRepo: AdminRepository = new AdminDatabase(AdminModel);

const router = express.Router();
router.post("/insertadmins", async (_req: Request,res :Response) => {
  const data = MockAdminData.map((admin) => (
    {
      ...admin,
      slug :slugify(admin.email +  Date.now().toString() + Math.floor(Math.random() * 100000),{lower:true,strict:true})
    }
  ))
    await adminRepo.addManyAdmins(data)
  res.send('inserted successfully');
})

router.delete("/deleteadmins", async (_req: Request,res :Response) => {
  await adminRepo.deleteAllAdmins();
  res.send('deleted successfully');
})

router.delete("/deleteadminbyids", async (req: Request,res :Response) => {
  const ids = req.body.ids
  await adminRepo.deleteManyAdmin(ids)
  res.send("deleted successfully")
})
export default router;