import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = 'profile-pictures'
): Promise<{ url: string; key: string }> => {
  const key = `${folder}/${Date.now()}-${file.originalname}`;
  
  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
    // Removed ACL: 'public-read' - bucket has ACLs disabled
  };

  const result = await s3.upload(params).promise();
  
  // Construct public URL manually
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  
  return {
    url: url,
    key: result.Key
  };
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key
  };

  await s3.deleteObject(params).promise();
};

export default s3;