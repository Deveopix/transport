import { BaseZodError } from "@/lib/zodSchemas/errorUtils";
import { z } from "zod";

export const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(32),
});

export const registerFormSchema = z.object({
	username: z.string().min(3).max(16),
	email: z.string().email(),
	password: z.string().min(8).max(32),
});

export type LoginFormError = BaseZodError<typeof loginFormSchema>;
export type RegisterFormError = BaseZodError<typeof registerFormSchema>;
