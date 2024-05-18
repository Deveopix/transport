import { BaseZodError } from "@/lib/zodSchemas/errorUtils";
import { z } from "zod";

export const loginFormSchema = z.object({
	phonenumber: z.string().startsWith("09").length(10),
	password: z.string().min(8).max(32),
});

export const registerFormSchema = z.object({
	username: z.string().min(3).max(16),
	phonenumber: z.string().startsWith("09").length(10),
	password: z.string().min(8).max(32),
});

export type LoginFormError = BaseZodError<typeof loginFormSchema>;
export type RegisterFormError = BaseZodError<typeof registerFormSchema>;
