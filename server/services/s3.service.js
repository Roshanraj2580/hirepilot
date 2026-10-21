import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Determine if AWS S3 credentials are configured in the environment
export const isS3Configured = () => {
    return Boolean(
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        process.env.AWS_S3_BUCKET_NAME
    );
};

// Initialize S3 Client instance
const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: isS3Configured()
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
        : undefined,
});

/**
 * Uploads a resume buffer to AWS S3 bucket
 * @param {Buffer} fileBuffer - Raw binary buffer of the PDF file
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File mimetype (application/pdf)
 * @returns {Promise<{ key: string, bucket: string }>}
 */
export const uploadResumeToS3 = async (fileBuffer, originalName, mimeType = "application/pdf") => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `resumes/${Date.now()}-${sanitizedName}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: mimeType,
        Metadata: {
            uploadedAt: new Date().toISOString(),
        },
    });

    await s3Client.send(command);

    return {
        key: fileKey,
        bucket: bucketName,
    };
};

/**
 * Downloads a resume buffer from AWS S3
 * @param {string} fileKey - S3 Object key
 * @returns {Promise<Buffer>}
 */
export const getResumeFromS3 = async (fileKey) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
    });

    const response = await s3Client.send(command);
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
};

/**
 * Deletes a temporary resume object from AWS S3
 * @param {string} fileKey - S3 Object key
 */
export const deleteResumeFromS3 = async (fileKey) => {
    if (!fileKey) return;

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
    });

    await s3Client.send(command);
};
