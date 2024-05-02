"use client";

import { RegisterFormError, registerFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export default function RegisterForm({
	registerAction,
}: {
	registerAction: (
		input: z.infer<typeof registerFormSchema>,
	) => Promise<RegisterFormError | undefined>;
}) {
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		const error = await registerAction(values);

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
					<span className="text-2xl font-medium">إنشاء حساب</span>
					<span className="text-sm text-muted-foreground">
						لديك حساب ؟{" "}
						<Link className="font-medium text-blue-400" href="/login">
							تسجيل الدخول
						</Link>
						.
					</span>
				</div>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="اسم المستخدم" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="البريد الالكتروني" {...field} />
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
								<Input type="password" placeholder="كلمة المرور" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					disabled={form.formState.isSubmitting}
					className="w-full"
					type="submit"
				>
					تسجيل حساب
				</Button>
			</form>
		</Form>
	);
}
