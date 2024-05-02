import { clsx, type ClassValue } from "clsx";
import { createHash } from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export default function hash(str: string) {
	const hash = createHash("sha256").update(str).digest("hex");

	return hash;
}
