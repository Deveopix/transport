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
} from "@/lib/zodSchemas/dashboardSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useOptimistic } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function TripInfoForm({
	tripInfo,
	updateTripInfoAction,
}: {
	tripInfo: z.infer<typeof tripInfoFormPartialSchema>;
	updateTripInfoAction: (
		input: z.infer<typeof tripInfoFormPartialSchema>,
	) => Promise<TripInfoFormError | undefined>;
}) {
	const [optTripInfo, setTripInfo] = useOptimistic(tripInfo);

	const form = useForm<z.infer<typeof tripInfoFormPartialSchema>>({
		resolver: zodResolver(tripInfoFormPartialSchema),
		defaultValues: optTripInfo,
	});

	async function onSubmit(values: z.infer<typeof tripInfoFormPartialSchema>) {
		startTransition(async () => {
			setTripInfo(values);
			const error = await updateTripInfoAction(values);

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
										<Input {...field} value={field.value ?? ""} />
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
