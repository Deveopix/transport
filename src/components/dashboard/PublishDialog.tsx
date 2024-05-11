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
import { tripInfoFormPartialSchema } from "@/lib/zodSchemas/dashboardSchemas";
import { DialogTitle } from "@radix-ui/react-dialog";
import { z } from "zod";

export default function PublishDialog({
	tripInfo,
	tripTimes,
	publishAction,
}: {
	tripInfo: z.infer<typeof tripInfoFormPartialSchema>;
	tripTimes: TripTime[];
	publishAction: () => Promise<string | undefined>;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-fit">نشر</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mt-5">
					<DialogTitle className="text-right">نشر الرحلة</DialogTitle>
				</DialogHeader>
				<SubmitButton className="w-fit" action={publishAction} failType="toast">
					نشر
				</SubmitButton>
			</DialogContent>
		</Dialog>
	);
}
