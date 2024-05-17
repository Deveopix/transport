"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Clockwise, CounterClockwise } from "@/lib/icons";
import { TB_tripVote, TripTime } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function BookTrip({
	forward,
	backward,
}: {
	forward: TripTime[];
	backward: TripTime[];
}) {
	const schema = z.object({
		forwardId: z
			.string()
			.refine((x) => forward.map((x) => x.id).includes(x), ""),
		backwardId: z
			.string()
			.refine((x) => backward.map((x) => x.id).includes(x), ""),
	});

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(values: z.infer<typeof schema>) {
		const user = await getUser();
		if (!user || !user.id) {
			return { error: "User not found" };
		}
		//
		const vote = {
			id: nanoid(),
			userId: user?.id,
			forwardTripTimeId: values.forwardId,
			backwardTripTimeId: values.backwardId,
		};
		try {
			await db.insert(TB_tripVote).values(vote);
		} catch {
			return { error: "error" };
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col items-start gap-8"
			>
				<div className="flex  items-center justify-center gap-2 text-2xl">
					<CounterClockwise className="h-[35px] w-[35px]" />
					<span>اوقات الذهاب</span>
				</div>
				<FormField
					control={form.control}
					name="forwardId"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									dir="rtl"
									className="flex flex-col gap-2"
								>
									{forward.map((time) => (
										<FormItem key={time.id} className="flex gap-3 p-2">
											<FormControl>
												<RadioGroupItem value={time.id} id={time.id} />
											</FormControl>
											<FormLabel htmlFor={time.id} dir="ltr">
												{new Date(time.time).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
													hour12: true,
												})}
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
						</FormItem>
					)}
				/>

				<div className="flex  items-center justify-center gap-2 text-2xl">
					<Clockwise className="h-[35px] w-[35px]" />
					<span>اوقات العودة</span>
				</div>
				<FormField
					control={form.control}
					name="backwardId"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									dir="rtl"
									className="flex flex-col gap-2"
								>
									{backward.map((time) => (
										<FormItem key={time.id} className="flex gap-3 p-2">
											<FormControl>
												<RadioGroupItem value={time.id} id={time.id} />
											</FormControl>
											<FormLabel htmlFor={time.id} dir="ltr">
												{new Date(time.time).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
													hour12: true,
												})}
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button className="h-[53px] w-[105px] text-xl">تأكيد</Button>
			</form>
		</Form>
	);
}
