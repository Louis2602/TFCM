import { Hero } from './_components/hero';
import { Services } from './_components/services';
import { Pricing } from './_components/pricing';
import { Testimonials } from './_components/testimonials';

export default function IndexPage() {
	return (
		<>
			<Hero />
			<Services />
			<Pricing />
			<Testimonials />
		</>
	);
}
