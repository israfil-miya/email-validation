import mongoose from 'mongoose'
const emailsDataSchema = new mongoose.Schema(
  {
    validated_emails: {
      type: [],
      required: true,
    },
  },
  { timestamps: true },
)

module.exports =
  mongoose.models.EmailData || mongoose.model('EmailData', emailsDataSchema)
