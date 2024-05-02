import { LoginForm } from "@/components/LoginForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import hash from "@/lib/utils";
import { LoginFormError } from "@/lib/zodSchemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
	email: string,
	password: string,
): Promise<LoginFormError | undefined> {
	"use server";

	const existingUser = await db.query.TB_user.findFirst({
		where: (user, { eq }) => eq(user.email, email),
	});

	const hashedPassword = hash(password);

	if (!existingUser) {
		return {
			field: "root",
			message: "Incorrect username or password",
		};
	}

	const validPassword = hashedPassword == existingUser.password;

	if (!validPassword) {
		return {
			field: "root",
			message: "Incorrect username or password",
		};
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return redirect("/");
}
