"use client";

import { ColumnDef } from "@tanstack/react-table";

export type BookedDetails = {
	username: string;
	forwardTripTime: Date;
	backwardTripTime: Date;
};

export const bookedColumns: ColumnDef<BookedDetails>[] = [
	{
		accessorKey: "username",
		header: "الأسم",
	},
	{
		accessorKey: "forwardTripTime",
		header: "وقت الذهاب",
	},
	{
		accessorKey: "backwardTripTime",
		header: "وقت الاياب",
	},
];
