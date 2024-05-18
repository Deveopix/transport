import BookTrip from "@/components/BookTrip";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_tripVote } from "@/lib/schema";
import { BaseZodError } from "@/lib/zodSchemas/errorUtils";
import { inArray, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { notFound } from "next/navigation";
import { ZodUnknown, z } from "zod";

interface TripDetailsProps {
	params: {
		id: string;
	};
}

export default async function TripDetails({ params }: TripDetailsProps) {
	const trip = await db.query.TB_trip.findFirst({
		where: (trip, { eq }) => eq(trip.id, params.id),
		with: {
			tripTimes: true,
		},
	});

	if (!trip) {
		return notFound();
	}

	const forward = trip.tripTimes
		.filter((x) => !x.isBackward)
		.sort((a, b) => a.time.getTime() - b.time.getTime());
	const backward = trip.tripTimes
		.filter((x) => x.isBackward)
		.sort((a, b) => a.time.getTime() - b.time.getTime());

	return (
		<section className="container flex flex-col gap-24 p-8">
			<div className="flex gap-12">
				<div className="flex flex-col gap-2">
					<span>اسم الرحلة : {trip.name}</span>
					<span>التاريخ : {trip.tripDate?.toDateString()}</span>
					<span>
						انتهاء التصويت : 2024/04/30 {trip.voteEnd?.toDateString()}
					</span>
				</div>
			</div>
			<BookTrip
				forward={forward}
				backward={backward}
				userBookAction={userBook.bind(null, trip.id)}
			/>
		</section>
	);
}

export async function userBook(
	tripId: string,
	values: {
		forwardId: string;
		backwardId: string;
	},
): Promise<BaseZodError<ZodUnknown> | undefined> {
	"use server";

	const user = await getUser();

	if (!user) {
		return {
			field: "root",
			message: "Unauthorized",
		};
	}

	const trip = await db.query.TB_trip.findFirst({
		where: (trip, { eq }) => eq(trip.id, tripId),
		with: {
			tripTimes: true,
		},
	});

	if (!trip) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}

	const forwardTripIds = trip.tripTimes
		.filter((x) => !x.isBackward)
		.map((x) => x.id);
	const backwardTripIds = trip.tripTimes
		.filter((x) => x.isBackward)
		.map((x) => x.id);

	const schema = z.object({
		forwardId: z.string().refine((x) => forwardTripIds.includes(x), ""),
		backwardId: z.string().refine((x) => backwardTripIds.includes(x), ""),
	});

	const validate = await schema.safeParseAsync(values);

	if (!validate.success) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}

	const vote = {
		id: nanoid(),
		userId: user.id,
		forwardTripTimeId: validate.data.forwardId,
		backwardTripTimeId: validate.data.backwardId,
	};

	try {
		await db.transaction(async (tx) => {
			await tx
				.delete(TB_tripVote)
				.where(
					or(
						inArray(TB_tripVote.forwardTripTimeId, forwardTripIds),
						inArray(TB_tripVote.backwardTripTimeId, backwardTripIds),
					),
				);
			await tx.insert(TB_tripVote).values(vote);
		});
	} catch {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}
}
