
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Email or phone number is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type LoginValues = z.infer<typeof loginSchema>;