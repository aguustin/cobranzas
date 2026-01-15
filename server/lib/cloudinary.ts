import { v2 as cloudinary } from 'cloudinary'
import { cloud_api_key, cloud_name, cloud_secret_key } from '../config.ts';
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
  cloud_name: cloud_name,
  api_key: cloud_api_key,
  api_secret: cloud_secret_key,
});

export default cloudinary;
