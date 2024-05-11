import { LoginForm } from "@/components/LoginForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import hash from "@/lib/utils";
import { LoginFormError, loginFormSchema } from "@/lib/zodSchemas/authSchemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export default function LoginPage() {
	return (
		<div className="absolute inset-0">
			<div className="mx-auto flex h-full w-full max-w-xs items-center md:max-w-sm">
				<LoginForm loginAction={LoginAction} />
			</div>
		</div>
	);
}

async function LoginAction(
	input: z.infer<typeof loginFormSchema>,
): Promise<LoginFormError | undefined> {
	"use server";

	try {
		const data = await loginFormSchema.parseAsync(input);

		const user = await db.query.TB_user.findFirst({
			where: (user, { eq }) => eq(user.email, data.email),
		});

		if (!user || user.password != hash(data.password)) {
			return { field: "root", message: "Email or password is incorrect" };
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}

	redirect("/trips");
}
