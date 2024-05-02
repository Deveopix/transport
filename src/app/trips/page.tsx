import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CounterClockwise } from "@/lib/icons";

const trips = [
	{
		tripName: "الكسوة",
		tripdate: new Date(),
		endingVote: new Date(),
	},
	{
		tripName: "درعا",
		tripdate: new Date(),
		endingVote: new Date(),
	},
	{
		tripName: "منين",
		tripdate: new Date(),
		endingVote: new Date(),
	},
	{
		tripName: "نوى",
		tripdate: new Date(),
		endingVote: new Date(),
	},
];

const receivedtrips = [trips[0]];
export default function TripsPage() {
	return (
		<section className="container flex flex-col gap-16 p-8">
			<div className="flex w-full flex-col gap-8">
				<span className="text-3xl">الرحلات </span>
				<div className="h-px w-full bg-border"></div>
				{trips.map((x) => (
					<Card key={x.tripName} className="w-[950px]">
						<CardContent className="flex items-center p-6 text-xl">
							<div className="grid w-full grid-cols-3 items-center">
								<span> اسم الرحلة :{x.tripName}</span>
								<span> تاريخ الرحلة :{x.tripdate.toLocaleDateString()}</span>
								<span>
									انتهاء التصويت :{" "}
									<span dir="ltr">{x.endingVote.toLocaleString()}</span>
								</span>
							</div>
							<Button>التفاصيل</Button>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex w-full flex-col gap-8">
				<span className="text-3xl">الرحلات المحجوزة</span>
				<div className="h-px w-full bg-border"></div>
				{receivedtrips.map((x) => (
					<Card key={x.tripName} className="w-[950px]">
						<CardContent className="flex items-center p-6 text-xl">
							<div className="grid w-full grid-cols-3 items-center">
								<span> اسم الرحلة :{x.tripName}</span>
								<span> تاريخ الرحلة :{x.tripdate.toLocaleDateString()}</span>
								<span>
									انتهاء التصويت :{" "}
									<span dir="ltr">{x.endingVote.toLocaleString()}</span>
								</span>
							</div>
							<Button>التفاصيل</Button>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="flex w-full flex-col gap-8">
				<div className="flex flex-col gap-2">
					<span>aymans</span>
					<CounterClockwise className="h-10 w-10 fill-black"></CounterClockwise>
				</div>
			</div>
		</section>
	);
}
