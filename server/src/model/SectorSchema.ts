import mongoose, { type UpdateQuery } from 'mongoose';
import slugify from 'slugify';

export interface ISectorSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
  slug: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SectorSchema = new mongoose.Schema<ISectorSchema>(
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
  },
  { timestamps: true, virtuals: true },
);

type SectorDeleteQuery = mongoose.Query<unknown, ISectorSchema> & {
  _sectorIdsToRemove?: mongoose.Types.ObjectId[];
};

const removeSectorReferences = async (sectorIds: mongoose.Types.ObjectId[]) => {
  if (sectorIds.length === 0) {
    return;
  }

  await Promise.all([
    mongoose.model('Category').updateMany({ sector: { $in: sectorIds } }, { $pull: { sector: { $in: sectorIds } } }),
    mongoose.model('Solution').updateMany({ sector: { $in: sectorIds } }, { $pull: { sector: { $in: sectorIds } } }),
  ]);
};

SectorSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true, strict: true });
  }
});

SectorSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  const update = this.getUpdate() as UpdateQuery<ISectorSchema>;
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

SectorSchema.pre('deleteMany', async function (this: SectorDeleteQuery) {
  const sectors = await this.model.find(this.getFilter()).select('_id').lean();
  this._sectorIdsToRemove = sectors.map((sector) => sector._id);
});

SectorSchema.post('findOneAndDelete', async function (doc: ISectorSchema | null) {
  if (doc) {
    await removeSectorReferences([doc._id]);
  }
});

SectorSchema.post('deleteMany', async function (this: SectorDeleteQuery) {
  await removeSectorReferences(this._sectorIdsToRemove ?? []);
});


const SectorModel: mongoose.Model<ISectorSchema> = mongoose.model<ISectorSchema>('Sector', SectorSchema);
export default SectorModel;
