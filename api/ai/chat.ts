import type { Request, Response } from 'express';
import forwardToExpress from '../../vercel-api-handler.ts';

export default function handler(req: Request, res: Response) {
  return forwardToExpress(req, res, '/api/ai/chat');
}
