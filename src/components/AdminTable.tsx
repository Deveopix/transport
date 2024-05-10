import React from "react";

interface Book {
	name: string;
	t1: string;
	t2: string;
}

interface Props {
	books: Book[];
	time: string;
}

const AdminTable: React.FC<Props> = ({ books, time }) => {
	const copyTableData = () => {
		const table = document.getElementById("admin-table");
		if (table) {
			const range = document.createRange();
			range.selectNode(table);
			window.getSelection()?.removeAllRanges();
			window.getSelection()?.addRange(range);
			document.execCommand("copy");
			window.getSelection()?.removeAllRanges();
			alert("Table data copied to clipboard!");
		}
	};

	return (
		<div className="container mx-auto">
			<div
				className="p- w-fit cursor-pointer border border-black p-1 text-center"
				onClick={copyTableData}
			>
				copy
			</div>
			<div className="overflow-x-auto">
				<table
					id="admin-table"
					className="w-full table-auto border-2 border-blue-900"
				>
					<thead>
						<tr>
							<th className="border px-4 py-3" colSpan={3}>
								اياب الساعة {time}
							</th>
						</tr>
						<tr>
							<th className="border-2 border-black px-3 py-2">الطالب</th>
							<th className="border-2 border-black px-3 py-2">الذهاب</th>
							<th className="border-2 border-black px-3 py-2">المدينة</th>
						</tr>
					</thead>
					<tbody>
						{books.map((book, index) => (
							<tr key={index} className="bg-gray-100">
								<td className="border px-3 py-2">{book.name}</td>
								<td className="border px-3 py-2">{book.t1}</td>
								<td className="border px-3 py-2">{book.t2}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminTable;
/*
اياب الساعة 12:00 pm
الطالب	الذهاب	المدينة
اياد برغوث	6:00	منين
ايمن	7:00	الكسوة

*/
