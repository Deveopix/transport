import { BaseZodError, timeSchema } from "@/lib/zodSchemas/errorUtils";
import { z } from "zod";

export const tripInfoFormSchema = z.object({
	name: z.string().min(1).max(32),
	tripDate: z.date(),
	voteEnd: z.date(),
	notes: z
		.string()
		.nullable()
		.transform((x) => x || null),
});

export const tripInfoFormPublishedSchema = z.object({
	voteEnd: z.date(),
	notes: z
		.string()
		.nullable()
		.transform((x) => x || null),
});

export const tripInfoFormPartialSchema = z.object({
	name: z
		.string()
		.max(32)
		.nullable()
		.transform((x) => x || null),
	tripDate: z.date().nullable(),
	voteEnd: z.date().nullable(),
	notes: z
		.string()
		.nullable()
		.transform((x) => x || null),
});

export const tripTimeFormSchema = z.object({
	time: timeSchema,
	isBackward: z.boolean(),
});

export const tripTimeUpdateFormSchema = tripTimeFormSchema.pick({ time: true });

export type TripInfoFormError = BaseZodError<typeof tripInfoFormSchema>;
export type TripTimeFormError = BaseZodError<typeof tripTimeFormSchema>;
export type TripTimeUpdateFormError = BaseZodError<
	typeof tripTimeUpdateFormSchema
>;
