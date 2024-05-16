import {
	bookedColumns,
	BookedDetails,
} from "@/components/dashboard/booked/BookedColumns";
import BookedTimeSelector from "@/components/dashboard/booked/BookedTimeSelector";
import QueryClientProvider from "@/components/QueryClientProvider";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TripTime, TripVote, UserType } from "@/lib/schema";
import { notFound } from "next/navigation";

interface BookedPageProps {
	params: {
		id: string;
	};
}

export default async function BookedPage({ params }: BookedPageProps) {
	const user = await getUser();

	if (!user) {
		return notFound();
	}

	const trip = await db.query.TB_trip.findFirst({
		where: (trip, { eq }) => eq(trip.id, params.id),
		with: {
			tripTimes: true,
		},
	});

	if (!trip || trip.managerId != user.id) {
		return notFound();
	}

	return (
		<div className="container space-y-6 p-8">
			<h1 className="text-xl font-medium">اسم الرحلة: {trip.name}</h1>
			<QueryClientProvider>
				<BookedTimeSelector
					tripTimes={trip.tripTimes}
					bookedColumns={bookedColumns}
					getBookedData={GetTripData.bind(null, trip.id)}
				/>
			</QueryClientProvider>
		</div>
	);
}

export type TripData = TripTime & {
	forwardTripVotes: (TripVote & {
		user: UserType;
		forwardTripTime: TripTime;
		backwardTripTime: TripTime;
	})[];
	// backwardTripVotes: (TripVote & {
	// 	user: UserType;
	// 	forwardTripTime: TripTime;
	// })[];
};

async function GetTripData(
	tripId: string,
	forwardTimeId?: string,
	backwardTimeId?: string,
): Promise<BookedDetails[]> {
	"use server";

	const user = await getUser();

	if (!user) {
		return [];
	}

	const trip = await db.query.TB_trip.findFirst({
		where: (trip, { and, eq }) =>
			and(eq(trip.id, tripId), eq(trip.managerId, user.id)),
		with: {
			tripTimes: {
				with: {
					forwardTripVotes: {
						where: (tripVote, { and, eq }) =>
							and(
								forwardTimeId
									? eq(tripVote.forwardTripTimeId, forwardTimeId)
									: undefined,
								backwardTimeId
									? eq(tripVote.backwardTripTimeId, backwardTimeId)
									: undefined,
							),
						with: {
							user: true,
							forwardTripTime: true,
							backwardTripTime: true,
						},
					},
					// backwardTripVotes: {
					// 	where: (tripVote, { eq }) =>
					// 		backwardTimeId
					// 			? eq(tripVote.backwardTripTimeId, backwardTimeId)
					// 			: undefined,
					// 	with: {
					// 		user: true,
					// 		forwardTripTime: true
					// 	},
					// },
				},
			},
		},
	});

	if (!trip) {
		return [];
	}

	// const trip = await db
	// 	.select()
	// 	.from(TB_trip)
	// 	.innerJoin(TB_tripTime, eq(TB_tripTime.tripId, TB_trip.id));

	// const tripVotes = await db.query.TB_tripVote.findMany({
	// 	where: (tripVote, { eq, and }) =>
	// 		and(
	// 			forwardTimeId
	// 				? eq(tripVote.forwardTripTimeId, forwardTimeId)
	// 				: undefined,
	// 			backwardTimeId
	// 				? eq(tripVote.backwardTripTimeId, backwardTimeId)
	// 				: undefined,
	// 		),
	// 	with: {
	// 		forwardTripTime: true,
	// 		backwardTripTime: true,
	// 		user: true,
	// 	},
	// });

	return TripDataToBookedData(trip.tripTimes);
}

function TripDataToBookedData(tripTimes: TripData[]) {
	const details: BookedDetails[] = [];
	const set = new Set();

	for (let tripTime of tripTimes) {
		for (let tripVote of tripTime.forwardTripVotes) {
			if (set.has(tripVote.id)) {
				continue;
			}

			set.add(tripVote.id);
			details.push({
				username: tripVote.user.username,
				forwardTripTime: tripVote.forwardTripTime.time,
				backwardTripTime: tripVote.backwardTripTime.time,
			});
		}

		// for (let tripVote of tripTime.backwardTripVotes) {
		// 	if (set.has(tripVote.id)) {
		// 		continue;
		// 	}

		// 	set.add(tripVote.id);
		// 	details.push({
		// 		username: tripVote.user.username,
		// 		forwardTripTime: tripTime.time,
		// 		backwardTripTime: tripVote.forwardTripTime.time,
		// 	});
		// }
	}

	return details;
}
