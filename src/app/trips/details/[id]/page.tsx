import BookTrip from "@/components/BookTrip";
import { userBook } from "@/components/userBook";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

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

				<div className=" flex flex-col gap-2">
					<span>اسم السائق اياد برغوث</span>
					<span>
						رقم هاتف السائق : <span dir="ltr">0954 273 566 </span>
					</span>
				</div>
			</div>
			<BookTrip
				forward={forward}
				backward={backward}
				userBookAction={userBook}
			/>
		</section>
	);
}
