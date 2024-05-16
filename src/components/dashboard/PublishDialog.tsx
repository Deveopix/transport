"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import SubmitButton from "@/components/ui/submitButton";
import { TripTime } from "@/lib/schema";
import { tripInfoFormSchema } from "@/lib/zodSchemas/dashboardSchemas";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function PublishDialog({
	disabled,
	tripInfo,
	tripTimes,
	publishAction,
}: {
	disabled: boolean;
	tripInfo: z.infer<typeof tripInfoFormSchema>;
	tripTimes: TripTime[];
	publishAction: () => Promise<string | undefined>;
}) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!disabled) {
			return;
		}

		setOpen(false);
	}, [disabled]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-fit" disabled={disabled}>
					نشر
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mt-5">
					<DialogTitle className="text-right">نشر الرحلة</DialogTitle>
				</DialogHeader>
				{!disabled && (
					<div className="flex flex-col gap-2">
						<span>أسم الرحلة: {tripInfo.name}</span>
						<span>تاريخ الرحلة: {tripInfo.tripDate.toLocaleDateString()}</span>
						<span>
							تاريخ أنتهاء التصويت: {tripInfo.voteEnd.toLocaleDateString()}
						</span>
					</div>
				)}
				<SubmitButton
					className="mr-auto w-fit"
					action={publishAction}
					failType="toast"
				>
					نشر الرحلة
				</SubmitButton>
			</DialogContent>
		</Dialog>
	);
}
