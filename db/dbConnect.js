import mongoose from 'mongoose'

const dbConnect = () => {
  if (mongoose.connections[0].readyState) {
    //console.log('Already connected.')
    return
  }

  try {
    mongoose
      .connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: process.env.DB_NAME,
      })
      .then(() => console.log('DATABASE CONNECTION SUCCESSFUL !!!\n'))
      .catch((err) => {
        throw new Error(err)
      })
  } catch (err) {
    console.log(err)
  }
}

export default dbConnect
