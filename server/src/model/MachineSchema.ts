import mongoose, { type UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import type { IAdminSchema } from './AdminSchema.js';

export interface IMachineSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
  slug: string;
  startingPrice: number;
  feature: IMachineDocSchema[];
  spec: IMachineDocSchema[];
  category: mongoose.Types.ObjectId[];
  solution: mongoose.Types.ObjectId[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMachineDocSchema {
  label: String;
  value: String;
}

const MachineSchema = new mongoose.Schema<IMachineSchema>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
      index: true,
    },
    description: { type: String, required: true },
    startingPrice: { type: Number },
    isActive: { type: Boolean, default: true },
    feature: [{ label: { type: String, required: true }, value: { type: String, required: true } }],
    spec: [{ label: { type: String, required: true }, value: { type: String, required: true } }],
    slug: { type: String, unique: true, index: true, required: true },
    imageUrl: { type: String },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    solution: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solution' }],
  },
  { timestamps: true, virtuals: true },
);

MachineSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true, strict: true });
  }
});

MachineSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  const update = this.getUpdate() as UpdateQuery<IAdminSchema>;
  const newName: string = update.name || (update.$set && update.$set.name);
  if (newName) {
    const newSlug = slugify(`${newName}-${Date.now()}`, { lower: true, strict: true });
    if (update.$set) {
      update.$set.slug = newSlug;
    } else {
      update.slug = newSlug;
    }
  }
});

const MachineModel: mongoose.Model<IMachineSchema> = mongoose.model<IMachineSchema>('Machine', MachineSchema);
export default MachineModel;
