import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="absolute inset-0">
			<div className="mx-auto flex h-full w-full max-w-xs items-center md:max-w-sm">
				<RegisterForm registerAction={undefined} />
			</div>
		</div>
	);
}
