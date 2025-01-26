import { z } from "zod"

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().url(),
})

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  assignedTo: userSchema,
})

export type Task = z.infer<typeof taskSchema>
export type User = z.infer<typeof userSchema>

