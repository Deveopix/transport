import { DataTable } from "@/components/DataTable";
import {
	BookedDetails,
	bookedColumns,
} from "@/components/dashboard/booked/BookedColumns";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";

import { notFound } from "next/navigation";

interface BookedPageProps {
	params: {
		id: string;
	};
}

export default async function BookedPage({ params }: BookedPageProps) {
	const user = await getUser();
	// var students: Promise<
	// 	{
	// 		id: string;
	// 		username: string;
	// 		email: string;
	// 		password: string;
	// 	}[]
	// >;

	if (!user) {
		return notFound();
	}

	const trip = await db.query.TB_trip.findFirst({
		where: (trip, { eq }) => eq(trip.id, params.id),
		with: {
			tripTimes: {
				where: (tripTime, { eq }) => eq(tripTime.isBackward, false),
				with: {
					forwardTripVotes: {
						with: {
							backwardTripTime: true,
							user: true,
						},
					},
					backwardTripVotes: {
						with: {
							forwardTripTime: true,
							user: true,
						},
					},
				},
			},
		},
	});

	if (!trip || trip.managerId != user.id) {
		return notFound();
	}

	const data: BookedDetails[] = [];

	for (let tripTime of trip.tripTimes) {
		for (let tripVote of tripTime.forwardTripVotes) {
			data.push({
				username: tripVote.user.username,
				forwardTripTime: tripTime.time,
				backwardTripTime: tripVote.backwardTripTime.time,
			});
		}

		for (let tripVote of tripTime.backwardTripVotes) {
			data.push({
				username: tripVote.user.username,
				forwardTripTime: tripTime.time,
				backwardTripTime: tripVote.forwardTripTime.time,
			});
		}
	}

	// async function handleClick(timeId: string) {
	// 	try {
	// 		students = await getStudent(timeId);
	// 	} catch (error) {
	// 		console.error("Error retrieving students:", error);
	// 	}
	// }

	return (
		<div className="container p-8">
			<DataTable columns={bookedColumns} data={data} />
		</div>
	);
}
