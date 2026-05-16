import mongoose, { type UpdateQuery } from 'mongoose';
import slugify from 'slugify';

export enum AdminRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IAdminSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  isActive: boolean;
  slug: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new mongoose.Schema<IAdminSchema>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    slug: { type: String, unique: true, index: true, required: true },
    isActive: { type: Boolean, default: true, index: true },
    role: { type: String, enum: Object.values(AdminRole), default: AdminRole.USER },
  },
  {
    timestamps: true,
    virtuals: true,
  },
);

AdminSchema.pre('save', function () {
  if (this.isModified('email')) {
    this.slug = slugify(`${this.email}-${Date.now()}`, { lower: true, strict: true });
  }
});

AdminSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  const update = this.getUpdate() as UpdateQuery<IAdminSchema>;
  const newEmail = update.email || (update.$set && update.$set.email);
  if (newEmail) {
    const newSlug = slugify(`${newEmail}-${Date.now()}`, { lower: true, strict: true });
    if (update.$set) {
      update.$set.slug = newSlug;
    } else {
      update.slug = newSlug;
    }
  }
});

const AdminModel: mongoose.Model<IAdminSchema> = mongoose.model<IAdminSchema>('Admin', AdminSchema);

export default AdminModel;
