import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_trip } from "@/lib/schema";
import { nanoid } from "nanoid";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const user = await getUser();

	if (!user) {
		return redirect("/login");
	}

	const trips = await db.query.TB_trip.findMany({
		where: (trip, { eq }) => eq(trip.managerId, user.id),
		orderBy: (trip) => trip.createdDate,
	});

	return (
		<div className="container p-8">
			<div className="flex flex-col gap-8">
				<div className="flex items-center gap-12">
					<span className="text-3xl">لوحة التحكم</span>
					<form
						action={async () => {
							"use server";

							const user = await getUser();

							if (!user) {
								return;
							}

							const id = nanoid();

							await db.insert(TB_trip).values({
								id: id,
								managerId: user.id,
								published: false,
							});

							return redirect(`/dashboard/edit/${id}`);
						}}
					>
						<Button size="lg">رحلة جديدة</Button>
					</form>
				</div>
				<div className="h-px w-full bg-border" />
				{trips.map((x) => (
					<Card key={x.id} className="max-w-lg">
						<CardContent className="grid gap-4 p-6">
							<div className="flex items-center">
								<span className="text-lg font-bold">مسودة</span>
								<span className="mr-auto">
									تاريخ الانشاء: {x.createdDate.toLocaleString()}
								</span>
							</div>
							{x.name && <span>اسم: {x.name}</span>}
							{x.tripDate && (
								<span>تاريخ الرحلة: {x.tripDate.toLocaleString()}</span>
							)}
							{x.voteEnd && (
								<span>تاريخ انتهاء التصويت: {x.voteEnd.toLocaleString()}</span>
							)}
							<div className="flex gap-2">
								<Button className="w-fit" asChild>
									<Link href={`/dashboard/edit/${x.id}`}>تفاصيل</Link>
								</Button>
								<Button className="w-fit" asChild>
									<Link href={`/dashboard/booked/${x.id}`}>الحجوزات</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
