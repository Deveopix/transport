"use client";

import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubmitButton from "@/components/ui/submitButton";
import { TripTime } from "@/lib/schema";
import {
	TripTimeFormError,
	TripTimeUpdateFormError,
	tripTimeFormSchema,
	tripTimeUpdateFormSchema,
} from "@/lib/zodSchemas/dashboardSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { fromDate, getLocalTimeZone, toTime } from "@internationalized/date";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TimeValue } from "react-aria";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TripTimeFormProps {
	addTripTimeAction: (
		input: z.infer<typeof tripTimeFormSchema>,
	) => Promise<TripTimeFormError | undefined>;
	updateTripTimeAction: (
		id: string,
		input: z.infer<typeof tripTimeUpdateFormSchema>,
	) => Promise<TripTimeUpdateFormError | undefined>;
	deleteTripTimeAction: (id: string) => Promise<string | undefined>;
	tripTimes: TripTime[];
	warnOnDelete: boolean;
	isBackward?: boolean;
}

export default function TripTimeForm({
	addTripTimeAction,
	updateTripTimeAction,
	deleteTripTimeAction,
	tripTimes,
	warnOnDelete,
	isBackward,
}: TripTimeFormProps) {
	const schema = tripTimeFormSchema.omit({ isBackward: true });

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			time: undefined,
		},
	});

	const watch = form.watch();
	const [timeFieldValue, setTimeFieldValue] = useState<TimeValue | undefined>(
		undefined,
	);

	useEffect(() => {
		if (!watch.time) {
			setTimeFieldValue(undefined);
			return;
		}

		const date = new Date();
		date.setHours(
			watch.time.hour ?? 0,
			watch.time.minute ?? 0,
			watch.time.second ?? 0,
			watch.time.millisecond ?? 0,
		);

		const parsed = fromDate(date, getLocalTimeZone());
		const time = toTime(parsed);

		setTimeFieldValue(time);
	}, [watch.time]);

	async function onSubmit(values: z.infer<typeof schema>) {
		const error = await addTripTimeAction({
			...values,
			isBackward: isBackward ?? false,
		});

		form.reset();

		if (error) {
			form.setError(
				error.field == "isBackward" ? "root" : error.field,
				{ message: error.message },
				{ shouldFocus: true },
			);
			return;
		}
	}

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>{!isBackward ? "أوقات الذهاب" : "أوقات العودة"}</CardTitle>
			</CardHeader>
			<CardContent className="flex grow flex-col gap-4">
				<Card className="h-fit">
					<CardContent className="p-6">
						<Form {...form}>
							<form
								className="flex items-center gap-4"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name="time"
									render={({ field }) => (
										<FormItem className="flex items-center gap-4 space-y-0">
											<FormLabel className="whitespace-nowrap">
												وقت الرحلة
											</FormLabel>
											<FormControl className="w-fit">
												<TimePicker
													hourCycle={12}
													granularity="minute"
													value={timeFieldValue}
													onChange={(e) => {
														field.onChange({
															hour: e.hour ?? 0,
															minute: e.minute ?? 0,
															second: e.second ?? 0,
															millisecond: e.millisecond ?? 0,
														});
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button className="mr-auto w-fit">أضافة</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
				{tripTimes.length > 0 && (
					<div className="relative flex-grow">
						<div className="absolute inset-0">
							<ScrollArea className=" h-full w-full">
								{tripTimes.map((x) => (
									<TripTimeCardForm
										key={x.id}
										tripTime={x}
										updateTripTimeAction={updateTripTimeAction.bind(null, x.id)}
										deleteTripTimeAction={deleteTripTimeAction.bind(null, x.id)}
										warnOnDelete={warnOnDelete}
									/>
								))}
							</ScrollArea>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function TripTimeCardForm({
	tripTime,
	updateTripTimeAction,
	deleteTripTimeAction,
	warnOnDelete,
}: {
	tripTime: TripTime;
	updateTripTimeAction: (
		input: z.infer<typeof tripTimeUpdateFormSchema>,
	) => Promise<TripTimeUpdateFormError | undefined>;
	deleteTripTimeAction: () => Promise<string | undefined>;
	warnOnDelete: boolean;
}) {
	const form = useForm<z.infer<typeof tripTimeUpdateFormSchema>>({
		resolver: zodResolver(tripTimeUpdateFormSchema),
		defaultValues: {
			time: undefined,
		},
	});

	const watch = form.watch();
	const [timeFieldValue, setTimeFieldValue] = useState<TimeValue | undefined>(
		toTime(fromDate(tripTime.time, getLocalTimeZone())),
	);

	useEffect(() => {
		const time = {
			hour: tripTime.time.getHours(),
			minute: tripTime.time.getMinutes(),
			second: tripTime.time.getSeconds(),
			millisecond: tripTime.time.getMilliseconds(),
		};

		form.setValue("time", time);
	}, [tripTime]);

	useEffect(() => {
		if (!watch.time) {
			setTimeFieldValue(undefined);
			return;
		}

		const date = new Date();
		date.setHours(
			watch.time.hour ?? 0,
			watch.time.minute ?? 0,
			watch.time.second ?? 0,
			watch.time.millisecond ?? 0,
		);

		const parsed = fromDate(date, getLocalTimeZone());
		const time = toTime(parsed);

		setTimeFieldValue(time);
	}, [watch.time]);

	async function onSubmit(values: z.infer<typeof tripTimeUpdateFormSchema>) {
		const error = await updateTripTimeAction(values);

		if (error) {
			form.setError(
				error.field,
				{ message: error.message },
				{ shouldFocus: true },
			);
			return;
		}

		toast.success("تم تحديث البيانات!");
	}

	return (
		<Card dir="rtl" className="mb-2 last:mb-0">
			<CardContent className="flex gap-4 p-6">
				<Form {...form}>
					<form
						className="flex items-center gap-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="time"
							render={({ field }) => (
								<FormItem className="flex items-center gap-4 space-y-0">
									<FormLabel className="whitespace-nowrap">
										وقت الرحلة
									</FormLabel>
									<FormControl className="w-fit">
										<TimePicker
											hourCycle={12}
											granularity="minute"
											value={timeFieldValue}
											onChange={(e) => {
												field.onChange({
													hour: e.hour ?? 0,
													minute: e.minute ?? 0,
													second: e.second ?? 0,
													millisecond: e.millisecond ?? 0,
												});
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-fit" variant="outline">
							تحديث
						</Button>
					</form>
				</Form>
				{warnOnDelete ? (
					<Dialog>
						<DialogTrigger asChild>
							<Button className="w-fit p-2" variant="destructive">
								<Trash2 />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader className="mt-5">
								<DialogTitle className="text-right">تحذير!</DialogTitle>
							</DialogHeader>
							<span className="text-right font-medium text-destructive">
								سيتم حذف جميع الحجوزات على المتعلقة بالوقت! هل انت متأكد؟
							</span>
							<div className="grid w-fit grid-cols-2 gap-2">
								<SubmitButton
									action={deleteTripTimeAction}
									variant="destructive"
								>
									نعم
								</SubmitButton>
								<DialogClose asChild>
									<Button>لا</Button>
								</DialogClose>
							</div>
						</DialogContent>
					</Dialog>
				) : (
					<SubmitButton
						action={deleteTripTimeAction}
						className="w-fit p-2"
						variant="destructive"
					>
						<Trash2 />
					</SubmitButton>
				)}
			</CardContent>
		</Card>
	);
}
