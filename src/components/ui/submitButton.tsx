"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const emptySchema = z.object({});

export default function SubmitButton({
	action,
	failType,
	successMessage,
	...props
}: ButtonProps &
	React.RefAttributes<HTMLButtonElement> & {
		action: () => Promise<string | undefined>;
		failType?: "label" | "toast";
		successMessage?: string;
	}) {
	const [error, setError] = useState<string | undefined>();

	const form = useForm<z.infer<typeof emptySchema>>({
		resolver: zodResolver(emptySchema),
	});

	async function onSubmit(_: z.infer<typeof emptySchema>) {
		const error = await action();

		if (!error) {
			if (successMessage) {
				toast.success(successMessage);
			}

			return;
		}

		switch (failType) {
			case "toast":
				toast.error(error);
				break;
			case "label":
			default:
				setError(error);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-center gap-2"
			>
				<Button {...props} disabled={form.formState.isSubmitting} />
				{error && <Label className="text-destructive">{error}</Label>}
			</form>
		</Form>
	);
}
