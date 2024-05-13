import { db } from "@/lib/db";

function mergeTripTimes(
	data: {
		id: string;
		userId: string;
		tripTimeId: string;
		user: {
			id: string;
			username: string;
			email: string;
			password: string;
		};
		tripTime: {
			id: string;
			tripId: string;
			time: Date;
			isBackward: boolean;
		};
	}[],
) {
	const mergedData: {
		username: string;
		forwardTime: Date;
		backwardTime: Date;
	}[] = [];
	data.forEach((element) => {
		if (element.tripTime.isBackward) {
			data.forEach((e2) => {
				if (!e2.tripTime.isBackward) {
					mergedData.push({
						username: element.user.username,
						forwardTime: e2.tripTime.time,
						backwardTime: element.tripTime.time,
					});
				}
			});
		}
	});

	return mergedData;
}
export default async function AdminPage({
	params,
}: {
	params: { id: string };
}) {
	const trip = await db.query.TB_tripTime.findFirst({
		where: (trip, { eq }) => eq(trip.id, params.id),
		with: {
			trip: true,
		},
	});
	const tripName = trip?.trip.name;
	const time = await db.query.TB_tripVote.findMany({
		where: (time, { eq }) => eq(time.tripTimeId, params.id),
	});
	const userIds = time.map((vote) => vote.userId);
	const books = await db.query.TB_user.findMany({
		where: (user, { inArray }) => inArray(user.id, userIds),
	});
	const users = books.map((vote) => vote.id);

	const time2 = await db.query.TB_tripVote.findMany({
		where: (time2, { inArray }) => inArray(time2.userId, users),
		with: {
			user: true,
			tripTime: true,
		},
	});
	const data = mergeTripTimes(time2);
	return (
		<div className="container mx-auto">
			{/* <div>{timeId}</div> */}
			<div className="overflow-x-auto">
				<table
					id="admin-table"
					className="w-full table-auto border-2 border-blue-900"
				>
					<thead>
						<tr>
							<th className="border px-4 py-3" colSpan={3}>
								{/* اياب الساعة {time.toTimeString()} */}
							</th>
						</tr>
						<tr>
							<th className="border-2 border-black px-3 py-2">الطالب</th>
							<th className="border-2 border-black px-3 py-2">الذهاب</th>
							<th className="border-2 border-black px-3 py-2">الاياب</th>
							<th className="border-2 border-black px-3 py-2">المدينة</th>
						</tr>
					</thead>
					<tbody>
						{data.map((user, index) => (
							<tr key={index} className="bg-gray-100">
								<td className="border px-3 py-2">{user.username}</td>
								<td className="border px-3 py-2">
									{new Date(user.forwardTime).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})}{" "}
								</td>
								<td className="border px-3 py-2">
									{new Date(user.backwardTime).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})}
								</td>
								<td className="border px-3 py-2">{tripName}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
