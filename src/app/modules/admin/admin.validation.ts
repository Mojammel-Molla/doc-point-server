import { z } from 'zod';

export const update = z.object({
  body: z.object({
    name: z.string(),
    contactNumber: z.string(),
  }),
});
