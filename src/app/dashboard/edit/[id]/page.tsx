import PublishDialog from "@/components/dashboard/PublishDialog";
import TripInfoForm from "@/components/dashboard/TripInfoForm";
import TripTimeForm from "@/components/dashboard/TripTimeForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import SubmitButton from "@/components/ui/submitButton";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_trip, TB_tripTime } from "@/lib/schema";
import {
	TripInfoFormError,
	TripTimeFormError,
	TripTimeUpdateFormError,
	tripInfoFormPartialSchema,
	tripInfoFormPublishedSchema,
	tripInfoFormSchema,
	tripTimeFormSchema,
	tripTimeUpdateFormSchema,
} from "@/lib/zodSchemas/dashboardSchemas";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

interface EditTripPageProps {
	params: {
		id: string;
	};
}

export default async function EditTripPage({ params }: EditTripPageProps) {
	const user = await getUser();

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

	const isValid =
		tripInfoFormSchema.safeParse(trip).success &&
		forward.length > 0 &&
		backward.length > 0;

	return (
		<div className="container p-8">
			<div className="flex flex-col gap-8">
				<div className="flex items-center gap-12">
					<span className="text-3xl">تعديل الرحلة</span>
					<Button asChild>
						<Link href="/dashboard">عودة</Link>
					</Button>
				</div>
				<div className="h-px w-full bg-border" />
				<div className="grid grid-cols-3 gap-8">
					<TripInfoForm
						tripInfo={trip}
						{...(trip.published
							? {
									published: true,
									editTripInfoAction: EditTripInfoAction.bind(null, trip.id),
								}
							: {
									published: false,
									updateTripInfoAction: UpdateTripInfoAction.bind(
										null,
										trip.id,
									),
								})}
					/>
					<TripTimeForm
						tripTimes={forward}
						addTripTimeAction={AddTripTimeAction.bind(null, trip.id)}
						updateTripTimeAction={UpdateTripTimeAction}
						deleteTripTimeAction={DeleteTripTimeAction}
						warnOnDelete={trip.published}
					/>
					<TripTimeForm
						tripTimes={backward}
						addTripTimeAction={AddTripTimeAction.bind(null, trip.id)}
						updateTripTimeAction={UpdateTripTimeAction}
						deleteTripTimeAction={DeleteTripTimeAction}
						warnOnDelete={trip.published}
						isBackward
					/>
				</div>
				<div className="mr-6 grid w-fit grid-cols-2 gap-2">
					{!trip.published && (
						<PublishDialog
							disabled={!isValid}
							tripInfo={trip as z.infer<typeof tripInfoFormSchema>}
							tripTimes={trip.tripTimes}
							publishAction={async () => {
								"use server";

								const user = await getUser();

								if (!user || user.id != trip.managerId) {
									return "Unauthorized";
								}

								try {
									await db
										.update(TB_trip)
										.set({ published: true })
										.where(eq(TB_trip.id, trip.id));
								} catch {
									return "An unexpected error occured, please try again later";
								}

								revalidatePath("/");
								redirect("/dashboard");
							}}
						/>
					)}

					{trip.published ? (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="destructive">حذف</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader className="mt-5">
									<DialogTitle className="text-right">تحذير!</DialogTitle>
								</DialogHeader>
								<span className="text-right font-medium text-destructive">
									سيتم حذف جميع الحجوزات المتعلقة بالرحلة! هل انت متأكد؟
								</span>
								<div className="grid w-fit grid-cols-2 gap-2">
									<SubmitButton
										action={DeleteTripAction.bind(null, trip.id)}
										variant="destructive"
									>
										نعم
									</SubmitButton>
									<DialogClose asChild>
										<Button>لا</Button>
									</DialogClose>
								</div>
							</DialogContent>
						</Dialog>
					) : (
						<SubmitButton
							variant="destructive"
							action={DeleteTripAction.bind(null, trip.id)}
						>
							حذف
						</SubmitButton>
					)}
				</div>
			</div>
		</div>
	);
}

async function DeleteTripAction(tripId: string) {
	"use server";

	const user = await getUser();

	if (!user) {
		return "Unauthorized";
	}

	try {
		await db
			.delete(TB_trip)
			.where(and(eq(TB_trip.id, tripId), eq(TB_trip.managerId, user.id)));
	} catch {
		return "An unexpected error occured, please try again later";
	}

	redirect("/dashboard");
}

async function UpdateTripInfoAction(
	id: string,
	input: z.infer<typeof tripInfoFormPartialSchema>,
): Promise<TripInfoFormError | undefined> {
	"use server";

	const user = await getUser();

	if (!user) {
		return {
			field: "root",
			message: "Unauthorized",
		};
	}

	try {
		await db
			.update(TB_trip)
			.set({ ...input })
			.where(eq(TB_trip.id, id));

		revalidatePath("/");
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}
}

async function EditTripInfoAction(
	id: string,
	input: z.infer<typeof tripInfoFormPublishedSchema>,
): Promise<TripInfoFormError | undefined> {
	"use server";

	const user = await getUser();

	if (!user) {
		return {
			field: "root",
			message: "Unauthorized",
		};
	}

	try {
		await db
			.update(TB_trip)
			.set({ ...input })
			.where(eq(TB_trip.id, id));

		revalidatePath("/");
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}
}

async function AddTripTimeAction(
	id: string,
	input: z.infer<typeof tripTimeFormSchema>,
): Promise<TripTimeFormError | undefined> {
	"use server";

	try {
		const date = new Date();
		date.setHours(input.time.hour ?? 0);
		date.setMinutes(input.time.minute ?? 0);
		date.setSeconds(input.time.second ?? 0);
		date.setMilliseconds(input.time.millisecond ?? 0);

		await db.insert(TB_tripTime).values({
			id: nanoid(),
			tripId: id,
			time: date,
			isBackward: input.isBackward,
		});

		revalidatePath("/");
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}
}

async function UpdateTripTimeAction(
	id: string,
	input: z.infer<typeof tripTimeUpdateFormSchema>,
): Promise<TripTimeUpdateFormError | undefined> {
	"use server";

	try {
		const date = new Date();
		date.setHours(input.time.hour ?? 0);
		date.setMinutes(input.time.minute ?? 0);
		date.setSeconds(input.time.second ?? 0);
		date.setMilliseconds(input.time.millisecond ?? 0);

		await db
			.update(TB_tripTime)
			.set({
				time: date,
			})
			.where(eq(TB_tripTime.id, id));

		revalidatePath("/");
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}
}

async function DeleteTripTimeAction(id: string): Promise<string | undefined> {
	"use server";

	try {
		await db.delete(TB_tripTime).where(eq(TB_tripTime.id, id));

		revalidatePath("/");
	} catch {
		return "An unexpected error occured, please try again later";
	}
}
