import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: import.meta.env.VITE_NEXT_PUBLIC_AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: import.meta.env.VITE_NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: import.meta.env.VITE_NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
});

export async function uploadPDF(pdfBlob: Blob, fileName: string): Promise<string> {
    try {
        const arrayBuffer = await pdfBlob.arrayBuffer();

        const command = new PutObjectCommand({
            Bucket: import.meta.env.VITE_NEXT_PUBLIC_AWS_BUCKET_NAME as string,
            Key: fileName,
            Body: new Uint8Array(arrayBuffer),
            ContentType: "application/pdf",
            ACL: "public-read",
        });

        await s3Client.send(command);

        return `https://${import.meta.env.VITE_NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (err) {
        console.error("❌ Upload PDF failed:", err);
        throw new Error("Upload PDF to S3 failed");
    }
}
