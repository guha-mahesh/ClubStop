import formidable from "formidable";
import { S3Client, PutObjectCommand, ObjectCannedACL, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Router, Request, Response } from 'express';
import fs from "fs";
import path from "path";
import { AuthRequest } from "../middleware/auth";
import verifyToken from "../middleware/auth";
import dotenv from 'dotenv'
import { pool } from '../server';
import { RowDataPacket } from "mysql2";

dotenv.config();

const router = Router();



const REGION = "us-east-2";
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID";
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY";

export const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});


const parseForm = (req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        const form = formidable({
            multiples: false,
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024,
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });
};






async function uploadHandler(req: AuthRequest, res: Response) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {




        const { fields, files } = await parseForm(req);
        const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId ?? null;








        const fileArray = files.image;
        if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const [fileURL] = await pool.execute<RowDataPacket[]>('SELECT profilePic FROM users WHERE users_id = ?', [userId])

        if (fileURL[0].profilePic) {
            const fileUrl = fileURL[0].profilePic;
            console.log(fileUrl)
            const fileName = fileUrl.split('/').pop();
            console.log(fileName)
            try {
                await s3.send(new DeleteObjectCommand({
                    Bucket: "clubstop",
                    Key: fileName,
                }));
                console.log(`deleted ${fileName} from S3`);
            } catch (err) {
                console.log("couldn't delete old pfp", err)
                res.json({
                    success: false,
                    erorr: err
                })
            }
        }

        const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;


        const fileBuffer = await fs.promises.readFile(file.filepath);


        const timestamp = Date.now();
        const ext = path.extname(file.originalFilename || '');
        const filename = `upload-${timestamp}${ext}`;

        const uploadParams = {
            Bucket: "clubstop",
            Key: filename,
            Body: fileBuffer,
            ContentType: file.mimetype || "application/octet-stream",
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const fileUrl = `https://${uploadParams.Bucket}.s3.${REGION}.amazonaws.com/${uploadParams.Key}`;


        await fs.promises.unlink(file.filepath);
        try {
            const [rows] = await pool.execute<RowDataPacket[]>(
                "UPDATE users SET profilePic = ? WHERE users_id = ?",
                [fileUrl, userId]
            );











        } catch (err) {
            console.log(err)
            try {
                await s3.send(new DeleteObjectCommand({
                    Bucket: "clubstop",
                    Key: filename,
                }));
                console.log(`Rolled back upload: deleted ${filename} from S3`);
            } catch (s3Err) {
                console.error("Failed to delete from S3:", s3Err);
            }

            return res.status(500).json({
                error: "Database update failed. Upload rolled back."
            });
        }

        return res.status(200).json({
            success: true,
            url: fileUrl,
            filename: filename,
            size: file.size,
            type: file.mimetype
        });

    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({
            error: "Upload failed",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
}



router.post("/image", verifyToken, uploadHandler);


export default router;