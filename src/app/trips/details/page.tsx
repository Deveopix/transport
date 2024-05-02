import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clockwise, CounterClockwise } from "@/lib/icons";

export default function TripDetails() {
	return (
		<section className="container flex flex-col gap-24 p-8">
			<div className="flex gap-12">
				<div className="flex flex-col gap-2">
					<span>اسم الرحلة : الكسوة</span>
					<span> التاريخ : 2024/05/01 ,الاربعاء</span>
					<span>انتهاء التصويت : 2024/04/30 PM 11:00</span>
				</div>

				<div className=" flex flex-col gap-2">
					<span>اسم السائق اياد برغوث</span>
					<span>
						رقم هاتف السائق : <span dir="ltr">0954 273 566 </span>
					</span>
				</div>
			</div>

			<form className="flex w-full flex-col items-start gap-8">
				<RadioGroup dir="rtl" className="flex flex-col gap-2">
					<div className="flex  items-center justify-center gap-2 text-2xl">
						<CounterClockwise className="h-[35px] w-[35px]" />
						<span>اوقات الذهاب</span>
					</div>
					<div className="flex gap-3 p-2">
						<RadioGroupItem value="option-one" id="option-one" />
						<Label htmlFor="option-one" dir="ltr">
							7:00 AM
						</Label>
					</div>
					<div className="flex gap-3 p-2">
						<RadioGroupItem value="option-two" id="option-two" />
						<Label htmlFor="option-one" dir="ltr">
							8:00 AM
						</Label>
					</div>

					<div className="flex gap-3 p-2">
						<RadioGroupItem value="option-three" id="option-three" />
						<Label htmlFor="option-one" dir="ltr">
							9:00 AM
						</Label>
					</div>
				</RadioGroup>

				<RadioGroup dir="rtl" className="flex flex-col gap-2">
					<div className="flex  items-center justify-center gap-2 text-2xl">
						<Clockwise className="h-[35px] w-[35px]" />
						<span>اوقات العودة</span>
					</div>

					<div className="flex gap-3 p-2">
						<RadioGroupItem value="option-one" id="option-one" />
						<Label htmlFor="option-one" dir="ltr">
							12:30 AM
						</Label>
					</div>
					<div className="flex gap-3 p-2">
						<RadioGroupItem value="option-two" id="option-two" />
						<Label htmlFor="option-two" dir="ltr">
							1:30 AM
						</Label>
					</div>

					<div className="flex gap-3 p-2">
						<RadioGroupItem value="option-three" id="option-three" />
						<Label htmlFor="option-three" dir="ltr">
							2:30 AM
						</Label>
					</div>
				</RadioGroup>

				<Button className="h-[53px] w-[105px] text-xl" type="submit">
					تأكيد
				</Button>
			</form>
		</section>
	);
}
