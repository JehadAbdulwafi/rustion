"use client"
import Image from "next/image"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What is rustion?",
    answer:
      "rustion is a video streaming platform that aims to provide top-tier solutions for livestreaming, multistreaming, video-on-demand (VOD) solutions, and IP camera streaming.",
  },
  {
    question: "Who is rustion best for?",
    answer: "",
  },
  {
    question: "Do I need anything else to stream with rustion?",
    answer: "",
  },
  {
    question: "Can I stream to a custom RTMP destination?",
    answer: "",
  },
  {
    question: "Can I stream to multiple platforms on rustion?",
    answer: "",
  },
  {
    question: "Is all content delivered via Akamai?",
    answer: "",
  },
  {
    question: "Does rustion support adaptive bitrate streaming?",
    answer: "",
  },
  {
    question: "Does rustion transcode uploaded videos to multi-bitrate?",
    answer: "",
  },
]

export function FAQ() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-zinc-400 mb-8">
              Can't find it here? Check out our{" "}
              <Link href="#" className="text-blue-500 hover:underline">
                Help Center
              </Link>
              .
            </p>
            <div className="relative lg:h-full min-h-[400px]">
              <Image
                src="/assets/FAQs.webp"
                alt="FAQ illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
