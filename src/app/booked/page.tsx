import React, { useState } from "react";
import AdminTable from "./../../components/AdminTable";

interface Book {
	name: string;
	t1: string;
	t2: string;
}

const AdminPage = () => {
	const [selectedTime, setSelectedTime] = useState<string>("12:00 pm");

	const books: Book[] = [
		{ name: "اياد برغوث", t1: "6:00", t2: "منين" },
		{ name: "ايمن علوية", t1: "7:00", t2: "الكسوة الكسوة" },
		{ name: "حمزة", t1: "8:00", t2: "الكسوة" },
	];

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedTime(event.target.value);
	};

	return (
		<>
			<div>
				<input
					type="radio"
					id="12pm"
					name="time"
					value="12:00 pm"
					checked={selectedTime === "12:00 pm"}
					onChange={handleTimeChange}
				/>
				<label htmlFor="12pm">12:00 pm</label>
				<input
					type="radio"
					id="2pm"
					name="time"
					value="2:00 pm"
					checked={selectedTime === "2:00 pm"}
					onChange={handleTimeChange}
				/>
				<label htmlFor="2pm">2:00 pm</label>
				<input
					type="radio"
					id="4pm"
					name="time"
					value="4:00 pm"
					checked={selectedTime === "4:00 pm"}
					onChange={handleTimeChange}
				/>
				<label htmlFor="4pm">4:00 pm</label>
			</div>
			<AdminTable books={books} time={selectedTime} />
		</>
	);
};

export default AdminPage;
