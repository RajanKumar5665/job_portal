import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAMES,
    api_key:process.env.API_KEYS,
    api_secret:process.env.API_SECRETS
});

export { cloudinary };
export default cloudinary;