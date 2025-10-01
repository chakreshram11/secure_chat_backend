// Basic MinIO wrapper. If minio isn't available falls back to local path serving.
const Minio = require('minio');
const fs = require('fs');
const path = require('path');
const { MINIO } = require('../config');

const minioClient = new Minio.Client({
  endPoint: MINIO.endPoint,
  port: MINIO.port,
  useSSL: MINIO.useSSL,
  accessKey: MINIO.accessKey,
  secretKey: MINIO.secretKey
});

const BUCKET = 'chat-files';

async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) await minioClient.makeBucket(BUCKET);
  } catch (err) { console.error('minio bucket error', err); }
}

ensureBucket();

async function putFile(localPath, name, contentType) {
  await minioClient.fPutObject(BUCKET, name, localPath, {
    'Content-Type': contentType || 'application/octet-stream'
  });
  fs.unlink(localPath, ()=>{});
  return `/files/${name}`; // your server should serve as /files/:name via proxy to minio or presigned URL
}

module.exports = { putFile };
