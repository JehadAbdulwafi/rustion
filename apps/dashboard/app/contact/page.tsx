import '@/styles/checkout.css';
import { Metadata } from "next"
import { SiteHeader } from '@/components/home/header/site-header'
import { Footer } from '@/components/home/footer'
import { getUser } from '@/lib/dal'
import { catchErrorTyped } from '@/api/ApiError'
import { ContactSalesForm } from "@/components/contact-form"
import { SuccessPageGradients } from '@/components/gradients/success-page-gradients';

export const metadata: Metadata = {
  title: "Contact Sales",
  description: "Get in touch with our sales team for any inquiries or support.",
}

export default async function ContactPage() {
  const [uerr, user] = await catchErrorTyped(getUser());

  return (
    <div className="relative flex min-h-screen overflow-hidden flex-col">
      <div data-wrapper="" className="border-grid flex flex-1 flex-col">
        <SiteHeader user={user} />
        <main className="flex flex-1 flex-col">
          <div className="relative">
            <SuccessPageGradients />
            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
              <div className="lg:pr-8">
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-blue-600">CONTACT US</h2>
                  <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Get In Touch With<br />Our Team</h1>
                  <p className="mt-4 text-lg text-gray-600">
                    Our team is committed to working with you<br />
                    to understand your unique needs and use case.<br />
                    If you're looking for Support, go <a href="#" className="text-blue-600 hover:underline">here</a>.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="mb-6 text-xl font-semibold">Talk with our team</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      Discuss your use case
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      Switching from in-house or competitor
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      Discuss features and pricing
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-background rounded-lg shadow-lg p-8">
                <ContactSalesForm />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
