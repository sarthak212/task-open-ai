import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "inprogress", "done"]).optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional().nullable(),
  project: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  userid: z.array(z.string()).optional().nullable(),
  timestamp: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
