import dotenv from "dotenv"
dotenv.config()

export const port = process.env.PORT
export const mongo_uri = process.env.MONGO_URI
export const jwt_secret_key = process.env.JWT_SECRET_KEY