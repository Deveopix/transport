"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginFormError } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(32),
});

export function LoginForm({
	loginAction,
}: {
	loginAction: (
		email: string,
		password: string,
	) => Promise<LoginFormError | undefined>;
}) {
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		const error = await loginAction(values);

		if (error) {
			form.setError(
				error.field,
				{ message: error.message },
				{ shouldFocus: true },
			);
			return;
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
				<div className="flex flex-col gap-1">
					<span className="text-2xl font-medium">Login</span>
					<span className="text-sm text-muted-foreground">
						New here?{" "}
						<Link className="font-medium text-blue-400" href="/register">
							Make an account
						</Link>
						.
					</span>
				</div>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="Email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="password" placeholder="Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<Link
						className="text-sm text-muted-foreground"
						href="/forgot-password"
					>
						Forgot password?
					</Link>
				</div>
				<Button
					disabled={form.formState.isSubmitting}
					className="w-full"
					type="submit"
				>
					Sign in
				</Button>
			</form>
		</Form>
	);
}
