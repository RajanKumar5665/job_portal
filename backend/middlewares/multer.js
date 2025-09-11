import multer from "multer";

const storage = multer.memoryStorage();
// Expect the field name 'resume' from the frontend profile form
export const singleUpload = multer({storage}).single("resume");