import mongoose, { type UpdateQuery } from 'mongoose';
import slugify from 'slugify';

export interface ISolutionSchema {
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

const SolutionSchema = new mongoose.Schema<ISolutionSchema>(
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

type SolutionDeleteQuery = mongoose.Query<unknown, ISolutionSchema> & {
  _solutionIdsToRemove?: mongoose.Types.ObjectId[];
};

const removeSolutionReferences = async (solutionIds: mongoose.Types.ObjectId[]) => {
  if (solutionIds.length === 0) {
    return;
  }

  await mongoose
    .model('Machine')
    .updateMany({ solution: { $in: solutionIds } }, { $pull: { solution: { $in: solutionIds } } });
};

SolutionSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true, strict: true });
  }
});

SolutionSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  const update = this.getUpdate() as UpdateQuery<ISolutionSchema>;
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

SolutionSchema.pre('deleteMany', async function (this: SolutionDeleteQuery) {
  const solutions = await this.model.find(this.getFilter()).select('_id').lean();
  this._solutionIdsToRemove = solutions.map((solution) => solution._id);
});

SolutionSchema.post('findOneAndDelete', async function (doc: ISolutionSchema | null) {
  if (doc) {
    await removeSolutionReferences([doc._id]);
  }
});

SolutionSchema.post('deleteMany', async function (this: SolutionDeleteQuery) {
  await removeSolutionReferences(this._solutionIdsToRemove ?? []);
});

const SolutionModel: mongoose.Model<ISolutionSchema> = mongoose.model<ISolutionSchema>('Solution', SolutionSchema);
export default SolutionModel;
