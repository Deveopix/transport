import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { db } from "@/lib/db";
import { Clockwise, CounterClockwise } from "@/lib/icons";
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

			<form className="flex w-full flex-col items-start gap-8">
				<RadioGroup dir="rtl" className="flex flex-col gap-2">
					<div className="flex  items-center justify-center gap-2 text-2xl">
						<CounterClockwise className="h-[35px] w-[35px]" />
						<span>اوقات الذهاب</span>
					</div>
					{forward.map((time, index) => (
						<div className="flex gap-3 p-2">
							<RadioGroupItem value={time.id} id={index.toString()} />
							<Label htmlFor={index.toString()} dir="ltr">
								{new Date(time.time).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								})}
							</Label>
						</div>
					))}
				</RadioGroup>

				<RadioGroup dir="rtl" className="flex flex-col gap-2">
					<div className="flex  items-center justify-center gap-2 text-2xl">
						<Clockwise className="h-[35px] w-[35px]" />
						<span>اوقات العودة</span>
					</div>
					{backward.map((time, index) => (
						<div className="flex gap-3 p-2">
							<RadioGroupItem
								value={time.id}
								id={index + forward.length.toString()}
							/>
							<Label htmlFor={index + forward.length.toString()} dir="ltr">
								{new Date(time.time).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								})}
							</Label>
						</div>
					))}
				</RadioGroup>

				<Button className="h-[53px] w-[105px] text-xl" type="submit">
					تأكيد
				</Button>
			</form>
		</section>
	);
}
