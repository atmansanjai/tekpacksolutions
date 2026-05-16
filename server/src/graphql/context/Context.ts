import AdminModel, { AdminRole, type IAdminSchema } from '../../model/AdminSchema.js';

import type { AdminRepository } from '../../Repository/AdminRepository.js';
import AdminDatabase from '../../database/AdminDatabase.js';

import AuthService from '../../service/AuthService.js';

import type { Request, Response } from 'express';

import type { SectorRepository } from '../../Repository/SectorRepository.js';
import SectorDatabase from '../../database/SectorDatabase.js';
import SectorModel from '../../model/SectorSchema.js';

import type { CategoryRepository } from '../../Repository/CategoryRepository.js';
import CategoryDatabase from '../../database/CategoryDatabase.js';
import CategoryModel from '../../model/CategorySchema.js';

import type { MachineRepository } from '../../Repository/MachineRepository.js';
import MachineDatabase from '../../database/MachineDatabase.js';
import MachineModel from '../../model/MachineSchema.js';

import type { SolutionRepository } from '../../Repository/SolutionRepository.js';
import SolutionDatabase from '../../database/SolutionDatabase.js';
import SolutionModel from '../../model/SolutionSchema.js';

export interface Context {
  id: string | null;
  adminRepo: AdminRepository;
  sectorRepo: SectorRepository;
  categoryRepo: CategoryRepository;
  machineRepo: MachineRepository;
  solutionRepo: SolutionRepository;
  user: Partial<IAdminSchema> | null;
}

export const createContext = async (req: Request, _res: Response): Promise<Context> => {
  const adminRepo: AdminRepository = new AdminDatabase(AdminModel);

  const sectorRepo: SectorRepository = new SectorDatabase(SectorModel);

  const categoryRepo: CategoryRepository = new CategoryDatabase(CategoryModel);

  const machineRepo: MachineRepository = new MachineDatabase(MachineModel);

  const solutionRepo: SolutionRepository = new SolutionDatabase(SolutionModel);

  const authService = new AuthService();

  const token: string | undefined = req.cookies?.accessToken;

  let user: Partial<IAdminSchema> | null = null;

  if (token) {
    const accessTokenPayload = authService.VerifyToken(token);

    if (accessTokenPayload) {
      user = await adminRepo.getAdminById(accessTokenPayload.id);
    }

    if (!user || user.role !== AdminRole.ADMIN) {
      user = null;
    }
  }

  return {
    id: user?._id?.toString() || null,
    adminRepo,
    sectorRepo,
    categoryRepo,
    machineRepo,
    solutionRepo,
    user,
  };
};
