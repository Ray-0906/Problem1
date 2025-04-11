import mongoose from 'mongoose';

const plantObservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    prediction: {
      species: { type: String },
      confidence: { type: Number }, // model confidence %
      status: {
        type: String,
        enum: ['pending', 'model-identified', 'ecologist-reviewed'],
        default: 'pending',
      },
    },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

plantObservationSchema.index({ location: '2dsphere' }); // for geo queries

const PlantObservation = mongoose.model('PlantObservation', plantObservationSchema);
export default PlantObservation;
