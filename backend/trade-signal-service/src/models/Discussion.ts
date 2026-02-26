import mongoose from 'mongoose';

export interface IComment {
  _id: mongoose.Types.ObjectId;
  content: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscussion {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdBy: mongoose.Types.ObjectId;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema<IDiscussion>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
  },
  { timestamps: true }
);

discussionSchema.index({ createdBy: 1 });
discussionSchema.index({ createdAt: -1 });

export const Discussion = mongoose.model<IDiscussion>('Discussion', discussionSchema);
