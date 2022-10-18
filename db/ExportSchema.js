import mongoose from 'mongoose'
const exportDataSchema = new mongoose.Schema(
  {
    stringData: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

module.exports =
  mongoose.models.ExportData || mongoose.model('ExportData', exportDataSchema)
