import RegisterForm from "@/components/RegisterForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import hash from "@/lib/utils";
import {
	RegisterFormError,
	registerFormSchema,
} from "@/lib/zodSchemas/authSchemas";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export default function RegisterPage() {
	return (
		<div className="absolute inset-0">
			<div className="mx-auto flex h-full w-full max-w-xs items-center md:max-w-sm">
				<RegisterForm registerAction={RegisterAction} />
			</div>
		</div>
	);
}

export async function RegisterAction(
	input: z.infer<typeof registerFormSchema>,
): Promise<RegisterFormError | undefined> {
	"use server";

	try {
		const data = await registerFormSchema.parseAsync(input);

		const newUser = {
			id: nanoid(),
			...data,
			password: hash(data.password),
		};

		try {
			await db.insert(TB_user).values(newUser);
		} catch {
			return { field: "phonenumber", message: "Phonenumber is already used!" };
		}

		const session = await lucia.createSession(newUser.id, {});
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

	return redirect("/trips");
}
