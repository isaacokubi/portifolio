import { del, put } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

export const config = { api: { bodyParser: false } };

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com';

function authorized(req) {
  const expected = process.env.PORTFOLIO_CV_UPLOAD_SECRET || '';
  const supplied = req.headers['x-portfolio-upload-key'] || '';
  if (!expected || typeof supplied !== 'string') return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

function send(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function readBody(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('FILE_TOO_LARGE');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function safeFilename(value) {
  const name = String(value || 'Isaac-Baraka-Ogubi-CV.pdf')
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .slice(0, 100);
  return name.toLowerCase().endsWith('.pdf') ? name : 'Isaac-Baraka-Ogubi-CV.pdf';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorized(req)) return send(res, 401, { error: 'Invalid or missing CV upload key.' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return send(res, 503, { error: 'CV storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.' });
  }

  try {
    if (req.method === 'POST') {
      const contentType = String(req.headers['content-type'] || '').toLowerCase();
      if (!contentType.startsWith('application/pdf')) {
        return send(res, 415, { error: 'Only PDF files can be uploaded.' });
      }
      const declaredLength = Number(req.headers['content-length'] || 0);
      if (declaredLength > MAX_FILE_SIZE) return send(res, 413, { error: 'The CV must be 4 MB or smaller.' });
      const file = await readBody(req, MAX_FILE_SIZE);
      if (file.length < 5 || file.subarray(0, 5).toString('ascii') !== '%PDF-') {
        return send(res, 415, { error: 'The selected file is not a valid PDF.' });
      }
      const filename = safeFilename(req.headers['x-cv-filename']);
      const blob = await put(`cv/${filename}`, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'application/pdf',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return send(res, 200, { url: blob.url, pathname: blob.pathname });
    }

    if (req.method === 'DELETE') {
      const raw = await readBody(req, 4096);
      let payload;
      try { payload = JSON.parse(raw.toString('utf8')); }
      catch { return send(res, 400, { error: 'Invalid delete request.' }); }
      let target;
      try { target = new URL(payload.url); }
      catch { return send(res, 400, { error: 'Invalid CV file URL.' }); }
      if (target.protocol !== 'https:' || !target.hostname.endsWith(BLOB_HOST_SUFFIX) || !target.pathname.includes('/cv/')) {
        return send(res, 400, { error: 'Only CV files stored in this portfolio Blob space can be removed.' });
      }
      await del(payload.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
      return send(res, 200, { deleted: true });
    }

    res.setHeader('Allow', 'POST, DELETE');
    return send(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    if (error.message === 'FILE_TOO_LARGE') return send(res, 413, { error: 'The CV must be 4 MB or smaller.' });
    console.error('CV storage request failed:', error);
    return send(res, 500, { error: 'CV storage request failed. Check the Vercel function logs.' });
  }
}
