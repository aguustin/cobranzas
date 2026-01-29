import { v2 as cloudinary } from 'cloudinary'
import { cloud_api_key, cloud_name, cloud_secret_key } from '../config.ts';
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
  cloud_name: cloud_name,
  api_key: cloud_api_key,
  api_secret: cloud_secret_key,
});

export const uploadFileToCloudinary = (file: Express.Multer.File): Promise<string> => {
        console.log('se ejecuta')
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {  resource_type: 'image', folder: 'cobranza_products' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result!.secure_url);
                }
            ).end(file.buffer);
        });
    }

export default cloudinary;
