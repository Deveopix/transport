"use client";
import React, { useEffect, useState } from "react";
import AdminTable from "./../../components/AdminTable";

interface Book {
	name: string;
	t1: string;
	t2: string;
}

const AdminPage = () => {
	const [selectedTime, setSelectedTime] = useState<string>("12:00 pm");
	const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

	const books_1: Book[] = [
		{ name: "اياد برغوث", t1: "6:00", t2: "منين" },
		{ name: "ايمن", t1: "7:00", t2: "الكسوة" },
	];
	const books_2: Book[] = [
		{ name: "احمد", t1: "6:00", t2: "مزة" },
		{ name: "يوسف", t1: "7:00", t2: "نوى" },
	];
	const books_3: Book[] = [{ name: "حمزة", t1: "8:00", t2: "الكسوة" }];

	useEffect(() => {
		if (selectedTime === "12:00 pm") {
			setSelectedBooks(books_1);
		} else if (selectedTime === "2:00 pm") {
			setSelectedBooks(books_2);
		} else if (selectedTime === "4:00 pm") {
			setSelectedBooks(books_3);
		} else if (selectedTime === "All Times") {
			setSelectedBooks([...books_1, ...books_2, ...books_3]);
		}
	}, [selectedTime]);

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedTime(event.target.value);
	};

	return (
		<>
			<div className="m-3 w-fit rounded-md border-2 border-blue-900 p-3">
				<input
					type="radio"
					id="12pm"
					name="time"
					value="12:00 pm"
					checked={selectedTime === "12:00 pm"}
					onChange={handleTimeChange}
					className="mr-2"
				/>
				<label htmlFor="12pm" className="mr-2">
					12:00 pm
				</label>
				<br />
				<input
					type="radio"
					id="2pm"
					name="time"
					value="2:00 pm"
					checked={selectedTime === "2:00 pm"}
					onChange={handleTimeChange}
					className="mr-2"
				/>
				<label htmlFor="2pm" className="mr-2">
					2:00 pm
				</label>
				<br />
				<input
					type="radio"
					id="4pm"
					name="time"
					value="4:00 pm"
					checked={selectedTime === "4:00 pm"}
					onChange={handleTimeChange}
					className="mr-2"
				/>
				<label htmlFor="4pm" className="mr-2">
					4:00 pm
				</label>
				<br />
				<input
					type="radio"
					id="allTimes"
					name="time"
					value="All Times"
					checked={selectedTime === "All Times"}
					onChange={handleTimeChange}
					className="mr-2"
				/>
				<label htmlFor="allTimes" className="mr-2">
					All Times
				</label>
			</div>
			<AdminTable books={selectedBooks} time={selectedTime} />
		</>
	);
};

export default AdminPage;
