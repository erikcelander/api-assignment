import mongoose from 'mongoose'

/**
 * Establishes a connection to a database.
 *
 * @param {string} connectionString - The connection used to open the MongoDB database.
 * @returns {Promise<void>} Resolves to this if connection succeeded.
 */
export const connectDB = async (connectionString: string): Promise<void> => {
  const { connection } = mongoose

  // Bind connection to events (to get notifications).
  connection.on('connected', () => console.log('MongoDB connection opened.'))
  connection.on('error', (err) => console.error(`MongoDB connection error occurred: ${err}`))
  connection.on('disconnected', () => console.log('MongoDB is disconnected.'))

  // If the Node.js process ends, close the connection.
  process.on('SIGINT', async () => {
    try {
      await connection.close()
      console.log('MongoDB disconnected due to application termination.')
      process.exit(0)
    } catch (err) {
      console.error(`Error occurred while disconnecting from MongoDB: ${err}`)
      process.exit(1)
    }
  })


  // Connect to the server.
  await mongoose.connect(connectionString)
}