import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Link } from "lucide-react";

export default async function TripsPage() {
	const trips = await db.query.TB_trip.findMany({
		where: (trips, { eq }) => eq(trips.published, true),
	});
	const receivedtrips = [trips[0]];

	return (
		<section className="container flex flex-col gap-16 p-8">
			<div className="flex w-full flex-col gap-8">
				<span className="text-3xl">الرحلات </span>
				<div className="h-px w-full bg-border"></div>
				{trips.map((x) => (
					<Card key={x.name} className="w-[950px]">
						<CardContent className="flex items-center p-6 text-xl">
							<div className="grid w-full grid-cols-3 items-center">
								<span> اسم الرحلة :{x.name}</span>
								<span> تاريخ الرحلة :{x.tripDate!.toLocaleDateString()}</span>
								<span>
									انتهاء التصويت :{" "}
									<span dir="ltr">{x.voteEnd!.toLocaleString()}</span>
								</span>
							</div>
							<Button>
								<Link href={`/trips/details/${x.id}`}></Link>
								التفاصيل
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex w-full flex-col gap-8">
				<span className="text-3xl">الرحلات المحجوزة</span>
				<div className="h-px w-full bg-border"></div>
				{receivedtrips.map((x) => (
					<Card key={x.name} className="w-[950px]">
						<CardContent className="flex items-center p-6 text-xl">
							<div className="grid w-full grid-cols-3 items-center">
								<span> اسم الرحلة :{x.name}</span>
								<span> تاريخ الرحلة :{x.tripDate!.toLocaleDateString()}</span>
								<span>
									انتهاء التصويت :{" "}
									<span dir="ltr">{x.voteEnd!.toLocaleString()}</span>
								</span>
							</div>
							<Button>التفاصيل</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
