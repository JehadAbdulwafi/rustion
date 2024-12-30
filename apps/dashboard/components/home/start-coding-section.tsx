import Image from 'next/image'
import Link from 'next/link'

export function StartCodingSection() {
  return (
    <div className="relative w-full py-24 overflow-hidden rounded-lg">
      <Image
        src="/assets/blue_background.avif"
        alt="Blue gradient background"
        fill
        className="object-cover"
        quality={100}
      />
      <div className="relative container mx-auto px-4 text-center text-white">
        <h2 className="text-5xl font-semibold mb-4">Start Streaming Now!</h2>
        <p className="text-lg mb-2">No credit card required.</p>
        <p className="text-lg mb-8">
          If you're interested in a custom plan or have any questions, please contact us.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-opacity-90 transition-all"
          >
            Signup Now →
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium border border-white hover:bg-blue-700 transition-all"
          >
            Contact us →
          </Link>
        </div>
      </div>
    </div>
  )
}
