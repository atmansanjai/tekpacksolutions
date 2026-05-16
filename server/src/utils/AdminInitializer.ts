import AdminModel, { AdminRole } from '../model/AdminSchema.js';
import Config from '../Config.js';
import slugify from 'slugify';

export const AdminInitializer = async () => {
  await AdminModel.findOneAndUpdate(
    { email: Config.admin.primaryEmail },
    {
      $setOnInsert: {
        name: 'Sanjai Govindraj',
        email: Config.admin.primaryEmail,
        isActive: true,
        role: AdminRole.ADMIN,
        slug: slugify(Config.admin.primaryEmail + Date.now().toString(), { lower: true, strict: true }),
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
};
