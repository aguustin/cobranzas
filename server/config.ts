import dotenv from "dotenv"
dotenv.config()

export const port = process.env.PORT
export const dev_url_front = process.env.DEV_URL_FRONT
export const dev_url_back = process.env.DEV_URL_BACK
export const mongo_uri = process.env.MONGO_URI
export const jwt_secret_key = process.env.JWT_SECRET_KEY
export const email_adm = process.env.EMAIL_ADM
export const nodemailer_pass = process.env.NODEMAILER_PAS