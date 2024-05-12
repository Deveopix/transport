import { db } from "@/lib/db";

interface AdminPageProps {
	params: {
		timeId: string;
	};
}

export default async function AdminPage({ params }: AdminPageProps) {
	//
	const time = await db.query.TB_tripVote.findMany({
		where: (vote, { eq }) => eq(vote.tripTimeId, params.timeId),
	});
	console.log(time);

	const userIds = time.map((vote) => vote.userId);
	//console.log(userIds);

	const books = await db.query.TB_user.findMany({
		where: (user, { inArray }) => inArray(user.id, userIds),
	});
	// console.log(books);

	return (
		<div className="container mx-auto">
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
							<th className="border-2 border-black px-3 py-2">المدينة</th>
						</tr>
					</thead>
					<tbody>
						{books.map((book, index) => (
							<tr key={index} className="bg-gray-100">
								<td className="border px-3 py-2">{book.username}</td>
								<td className="border px-3 py-2">{book.email}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
