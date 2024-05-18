"use server";

import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_tripVote } from "@/lib/schema";
import { nanoid } from "nanoid";

export async function userBook(values: {
	forwardId: string;
	backwardId: string;
}) {
	const user = await getUser();
	if (!user || !user.id) {
		return { error: "User not found" };
	}
	const vote = {
		id: nanoid(),
		userId: user?.id,
		forwardTripTimeId: values.forwardId,
		backwardTripTimeId: values.backwardId,
	};
	try {
		await db.insert(TB_tripVote).values(vote);
		return {};
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}
}
