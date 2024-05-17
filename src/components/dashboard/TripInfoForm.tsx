"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	TripInfoFormError,
	tripInfoFormPartialSchema,
	tripInfoFormPublishedSchema,
} from "@/lib/zodSchemas/dashboardSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useOptimistic } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type TripInfoFormProps = {
	tripInfo: z.infer<typeof tripInfoFormPartialSchema>;
} & (
	| {
			published: true;
			editTripInfoAction: (
				input: z.infer<typeof tripInfoFormPublishedSchema>,
			) => Promise<TripInfoFormError | undefined>;
	  }
	| {
			published?: false;
			updateTripInfoAction: (
				input: z.infer<typeof tripInfoFormPartialSchema>,
			) => Promise<TripInfoFormError | undefined>;
	  }
);

export default function TripInfoForm({
	tripInfo,
	...props
}: TripInfoFormProps) {
	const [optTripInfo, setTripInfo] = useOptimistic(tripInfo);

	const schema = props.published
		? tripInfoFormPublishedSchema
		: tripInfoFormPartialSchema;

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: optTripInfo,
	});

	async function onSubmit(values: z.infer<typeof schema>) {
		startTransition(async () => {
			setTripInfo({
				...optTripInfo,
				...values,
			});

			const error = props.published
				? // @ts-ignore
					await props.editTripInfoAction(values)
				: // @ts-ignore
					await props.updateTripInfoAction(values);

			if (error) {
				form.setError(
					error.field,
					{ message: error.message },
					{ shouldFocus: true },
				);

				return;
			}

			toast.success("تم تحديث البيانات!");
		});
	}

	useEffect(() => {
		form.reset(optTripInfo);
	}, [optTripInfo]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>معلومات الرحلة</CardTitle>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>اسم الرحلة</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value ?? ""}
											readOnly={props.published}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tripDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="tripDate">تاريخ الرحلة</FormLabel>
									<FormControl>
										<DateTimePicker
											jsDate={field.value}
											onJsDateChange={field.onChange}
											isReadOnly={props.published}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="voteEnd"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="voteEnd">تاريخ أنتهاء التصويت</FormLabel>
									<FormControl>
										<DateTimePicker
											granularity="minute"
											hourCycle={12}
											jsDate={field.value}
											onJsDateChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>ملاحظات (أختياري)</FormLabel>
									<FormControl>
										<Textarea {...field} value={field.value ?? ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button
							disabled={form.formState.isSubmitting || !form.formState.isDirty}
						>
							تأكيد
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
