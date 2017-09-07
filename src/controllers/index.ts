import { Request, Response } from 'express';

/**
 * GET /
 */
export let getIndex = (req: Request, res: Response) => {
  res.json('Hello!');
};
