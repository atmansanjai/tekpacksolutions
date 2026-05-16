import mongoose, { type UpdateQuery } from 'mongoose';
import slugify from 'slugify';

export interface ICategorySchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
  slug: string;
  sector: mongoose.Types.ObjectId[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema<ICategorySchema>(
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
    isActive: { type: Boolean, default: true },
    slug: { type: String, unique: true, index: true, required: true },
    imageUrl: { type: String },
    sector: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sector' }],
  },
  { timestamps: true, virtuals: true },
);

type CategoryDeleteQuery = mongoose.Query<unknown, ICategorySchema> & {
  _categoryIdsToRemove?: mongoose.Types.ObjectId[];
};

const removeCategoryReferences = async (categoryIds: mongoose.Types.ObjectId[]) => {
  if (categoryIds.length === 0) {
    return;
  }

  await mongoose
    .model('Machine')
    .updateMany({ category: { $in: categoryIds } }, { $pull: { category: { $in: categoryIds } } });
};

CategorySchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true, strict: true });
  }
});

CategorySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  const update = this.getUpdate() as UpdateQuery<ICategorySchema>;
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

CategorySchema.pre('deleteMany', async function (this: CategoryDeleteQuery) {
  const categories = await this.model.find(this.getFilter()).select('_id').lean();
  this._categoryIdsToRemove = categories.map((category) => category._id);
});

CategorySchema.post('findOneAndDelete', async function (doc: ICategorySchema | null) {
  if (doc) {
    await removeCategoryReferences([doc._id]);
  }
});

CategorySchema.post('deleteMany', async function (this: CategoryDeleteQuery) {
  await removeCategoryReferences(this._categoryIdsToRemove ?? []);
});

const CategoryModel: mongoose.Model<ICategorySchema> = mongoose.model<ICategorySchema>('Category', CategorySchema);
export default CategoryModel;
