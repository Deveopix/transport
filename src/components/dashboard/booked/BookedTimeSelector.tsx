"use client";

import { DataTable } from "@/components/DataTable";
import { BookedDetails } from "@/components/dashboard/booked/BookedColumns";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TripTime } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export default function BookedTimeSelector({
	tripTimes,
	// BookedDetails,
	bookedColumns,
	getBookedData,
}: {
	tripTimes: TripTime[];
	bookedColumns: ColumnDef<BookedDetails>[];
	getBookedData: (
		forwardTimeId?: string,
		backwardTimeId?: string,
	) => Promise<BookedDetails[]>;
}) {
	const [forwardId, setForwardId] = useState<"all" | string>("all");
	const [backwardId, setBackwardId] = useState<"all" | string>("all");

	const { isFetching, isPending, isError, data } = useQuery({
		queryKey: [forwardId, backwardId],
		queryFn: async () =>
			await getBookedData(
				forwardId == "all" ? undefined : forwardId,
				backwardId == "all" ? undefined : backwardId,
			),
		refetchOnWindowFocus: false,
	});

	return (
		<>
			<div className="flex items-center gap-8">
				<div className="flex items-center gap-2">
					<Label>اوقات الذهاب:</Label>
					<Select
						onValueChange={(e) => setForwardId(e.valueOf())}
						defaultValue={forwardId}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="اوقات الذهاب" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all">الجميع</SelectItem>
								{tripTimes
									.filter((x) => !x.isBackward)
									.map((x) => (
										<SelectItem key={x.id} value={x.id}>
											{x.time.toLocaleTimeString()}
										</SelectItem>
									))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<Label>اوقات الاياب:</Label>
					<Select
						onValueChange={(e) => setBackwardId(e.valueOf())}
						defaultValue={forwardId}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="اوقات الاياب" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all">الجميع</SelectItem>
								{tripTimes
									.filter((x) => x.isBackward)
									.map((x) => (
										<SelectItem key={x.id} value={x.id}>
											{x.time.toLocaleTimeString()}
										</SelectItem>
									))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
			{isError ? (
				<h1 className="text-xl font-medium">حصل خطأ!</h1>
			) : isFetching || isPending ? (
				<h1 className="text-xl font-medium">جاري تحميل البيانات...</h1>
			) : (
				<DataTable columns={bookedColumns} data={data} />
			)}
		</>
	);
}
