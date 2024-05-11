const time = new Date();

const books = [
	{ name: "اياد برغوث", time: new Date(), city: "منين" },
	{ name: "ايمن", time: new Date(), city: "الكسوة" },
] as const;

export default function AdminPage() {
	return (
		<div className="container mx-auto">
			<div className="overflow-x-auto">
				<table
					id="admin-table"
					className="w-full table-auto border-2 border-blue-900"
				>
					<thead>
						<tr>
							<th className="border px-4 py-3" colSpan={3}>
								اياب الساعة {time.toTimeString()}
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
								<td className="border px-3 py-2">{book.time.toTimeString()}</td>
								<td className="border px-3 py-2">{book.city}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
