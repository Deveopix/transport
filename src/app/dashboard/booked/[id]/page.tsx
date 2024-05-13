import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Link } from "lucide-react";
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
		return;
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

	const forward = trip.tripTimes
		.filter((x) => !x.isBackward)
		.sort((a, b) => a.time.getTime() - b.time.getTime());
	const backward = trip.tripTimes
		.filter((x) => x.isBackward)
		.sort((a, b) => a.time.getTime() - b.time.getTime());
	const allTime = [...backward, ...forward];

	// async function handleClick(timeId: string) {
	// 	try {
	// 		students = await getStudent(timeId);
	// 	} catch (error) {
	// 		console.error("Error retrieving students:", error);
	// 	}
	// }

	return (
		<div className="container p-8">
			<div className="flex flex-row gap-1">
				{allTime.map((time) => (
					<Button key={time.id}>
						{time.time.toLocaleTimeString()}
						<Link href={`/booked/${time.id}`}></Link>
					</Button>
				))}
			</div>
			{/* <div className="container mx-auto">
				<div className="overflow-x-auto">
					<table
						id="admin-table"
						className="w-full table-auto border-2 border-blue-900"
					>
						<thead>
							<tr>
								<th className="border-2 border-black px-3 py-2">الطالب</th>
								<th className="border-2 border-black px-3 py-2">
									البريد الإلكتروني
								</th>
								<th className="border-2 border-black px-3 py-2">كلمة المرور</th>
							</tr>
						</thead>
						<tbody>
							{students &&
								students.map((student, index) => (
									<tr key={index} className="bg-gray-100">
										<td className="border px-3 py-2">{student.username}</td>
										<td className="border px-3 py-2">{student.email}</td>
										<td className="border px-3 py-2">{student.password}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div> */}
		</div>
	);
}

async function getStudent(timeId: string): Promise<
	{
		id: string;
		username: string;
		email: string;
		password: string;
	}[]
> {
	try {
		const time = await db.query.TB_tripVote.findMany({
			where: (vote, { eq }) => eq(vote.tripTimeId, timeId),
		});

		const userIds = time.map((vote) => vote.userId);

		const students = await db.query.TB_user.findMany({
			where: (user, { inArray }) => inArray(user.id, userIds),
		});

		return students;
	} catch (error) {
		console.error("Error retrieving students:", error);
		throw error;
	}
}
