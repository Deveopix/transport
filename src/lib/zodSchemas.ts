import { Path } from "react-hook-form";
import { ZodType, z } from "zod";

export interface BaseZodError<T extends ZodType<any, any, any>> {
	field: Path<z.TypeOf<T>> | "root";
	message: string;
}

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
