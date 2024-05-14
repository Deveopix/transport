import { db } from "@/lib/db";

export default async function AdminPage({
	params,
}: {
	params: { id: string };
}) {
	const bookings = await db.query.TB_tripVote.findMany({
		where: (tripVote, { or, eq }) =>
			or(
				eq(tripVote.forwardTripTimeId, params.id),
				eq(tripVote.backwardTripTimeId, params.id),
			),
		with: {
			forwardTripTime: true,
			backwardTripTime: true,
			user: true,
		},
	});

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
						</tr>
					</thead>
					<tbody>
						{bookings.map((booking, index) => (
							<tr key={index} className="bg-gray-100">
								<td className="border px-3 py-2">{booking.user.username}</td>
								<td className="border px-3 py-2">
									{booking.forwardTripTime.time.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})}
								</td>
								<td className="border px-3 py-2">
									{booking.backwardTripTime.time.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
