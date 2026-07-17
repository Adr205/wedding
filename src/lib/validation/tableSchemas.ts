import { z } from "zod";

export const tableInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  capacity: z.number().int().min(1).max(60).default(8),
  shape: z.enum(["round", "rect"]).default("round"),
});

export type TableInput = z.infer<typeof tableInputSchema>;

export const tablePatchSchema = tableInputSchema.partial();
export type TablePatch = z.infer<typeof tablePatchSchema>;
