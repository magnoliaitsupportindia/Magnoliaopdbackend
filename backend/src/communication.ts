import { Injectable } from "@nestjs/common";
import { S3 } from 'aws-sdk';
import { json } from "express";
// import { stringify } from "node:querystring";
@Injectable()
export class CommunicationService {
    //upload File 
    async uploadPublicFile(dataBuffer: Buffer, filename: string, fileMineType: string) {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Body: dataBuffer,
            Key: filename,
            ContentType: fileMineType
        }).promise();

        return {
            key: uploadResult.Key,
            url: uploadResult.Location,
        }

    }

    async uploadTemplateData(data: object, filename: string) {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            // Body : JSON.stringify(data),
            Body: data,
            Key: filename + '.json',
            ContentType: 'application/json'
        }).promise();
        return {
            key: uploadResult.Key,
            url: uploadResult.Location,
        }

    }
    getAttachmentImage(key) {
        const params = {
            Key: key,
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Expires: 60,
        };
        return new Promise(async (resolve, reject) => {
            try {
                const s3 = new S3();
                const url = await new Promise((resolve, reject) => {
                    s3.getSignedUrl('getObject', params, (err, url) => {
                        err ? reject(err) : resolve(url);
                    });
                });
                resolve(url);
            } catch (err) {
                if (err) {
                    reject(err);
                }
            }
        });
    }
}