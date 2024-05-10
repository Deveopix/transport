import React from "react";

interface Book {
	name: string;
	t1: string;
	t2: string;
}

interface Props {
	books: Book[];
	time: String;
}

const AdminTable: React.FC<Props> = ({ books, time }) => {
	return (
		<div className="container mx-auto">
			<div className="overflow-x-auto">
				<table className="w-full table-auto">
					<thead>
						<tr>
							<th className="border px-4 py-3" colSpan={3}>
								اياب الساعة {time}
							</th>
						</tr>
						<tr>
							<th className="border px-3 py-2">الطالب</th>
							<th className="border px-3 py-2">الذهاب</th>
							<th className="border px-3 py-2">المدينة</th>
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
