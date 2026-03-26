import mongoose from 'mongoose'
import { DB_URI, NODE_ENV } from '../config/env.js'

const connectMongodb = async function () {
  try {
    if (!DB_URI) {
      console.error
        ('Please include a mongodb DB_URI environmemnt variable inside .env');
      process.exit(1)
    }
    
    await mongoose.connect(DB_URI)
    
    const URI_Parts = DB_URI.split(/:\/\/|\?|:|@|\//)
    console.log("Connected to database: ", {
      user: URI_Parts[1],
      clusterHost: URI_Parts[3],
      database: URI_Parts[4],
      uriParams: URI_Parts[5],
      nodeEnvironment: NODE_ENV,
    });
  } 
  catch (error) {
    console.error('Error connecting to database: ', error)
    process.exit(1)
  }
}

export default connectMongodb;