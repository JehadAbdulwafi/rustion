import { StarRating } from "../ui/star-rating"

interface TestimonialCardProps {
  content: string
  author: string
  role: string
}

function TestimonialCard({ content, author, role }: TestimonialCardProps) {
  return (
    <div className="rounded-lg bg-[#1A1D24] p-6">
      <p className="text-zinc-300 text-lg mb-8">{content}</p>
      <StarRating />
      <h3 className="mt-2 font-semibold text-white">{author}</h3>
      <p className="text-zinc-400 text-sm">{role}</p>
    </div>
  )
}

const testimonials = [
  {
    content: "The glue that brings things together. Very easy to use with lots of platforms available to choose from. Support is very responsive if you have any issues.",
    author: "Clayton C.",
    role: "Assistant Director, Government Administration"
  },
  {
    content: "Our overall experience with rustion has been completely positive. We stream weekly to Facebook, YouTube, and Periscope all at the same time, and have really seen an improvement in our social media reach and especially engagement. It's a really fair price and a great service.",
    author: "Brian C.",
    role: "General Manager, Entertainment"
  },
  {
    content: "Overall rustion has been excellent and in the few issues I have experienced, customer service has sorted things out very quickly. I have never had my stream cut out. It offers Pull URL at no extra cost on my package which is much cheaper than other similar services.",
    author: "Stephen C.",
    role: "Content Creator, Media Production"
  },
  {
    content: "A critical part of our stream. rustion was exactly what we needed to livestream our show on multiple platforms at the same time. Simply put, we wouldn't have the audience that we currently do without rustion. It's an integral part of our daily operation.",
    author: "Todd D.",
    role: "General Manager, Broadcast Media"
  },
  {
    content: "Best multistreaming out there! When looking for a solution to livestream to both Facebook and YouTube, we came across rustion and it solved all of our issues. We love the fact that it doesn't require you to put any of their branding in the descriptions and that the stream looks great on both sites.",
    author: "Jake B.",
    role: "Creative Director, Religious Institution"
  },
  {
    content: "The customer service has been great. Questions are answered in a timely manner and completely.",
    author: "Tim W.",
    role: "Assistant Pastor, Religious Institution"
  },
]

export function Testimonials() {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance] space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="break-inside-avoid">
              <TestimonialCard
                content={testimonial.content}
                author={testimonial.author}
                role={testimonial.role}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
