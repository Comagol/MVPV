import mongoose, { Document, Schema } from "mongoose";

//Creo la interfaz para TypesCript
export interface IVote extends Document {
  userId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  matchId: mongoose.Types.ObjectId;
  fechaVoto: Date;
  token?: string;
}

//Schema de moongose
const voteSchema = new Schema<IVote>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playerId: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  fechaVoto: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

//Indices para mejorar la performance
voteSchema.index({ userId: 1, matchId: 1}, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);