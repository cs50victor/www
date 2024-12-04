import { Link } from 'next-view-transitions';

export function AnimatedName() {
  return (
    <Link href="/" className="flex mb-8 font-medium text-gray-400 fade-in font-serif text-lg">
      Victor A.
    </Link>
  );
}
