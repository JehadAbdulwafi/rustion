"use server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, MessageCircle, Book, Github } from 'lucide-react';
import { getFAQs } from '@/api/faqsApi';

export default async function SupportPage() {
  const faqs = await getFAQs();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Center</CardTitle>
          <CardDescription>
            Find answers to common questions or reach out to our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4 flex items-center space-x-4">
              <Mail className="h-6 w-6" />
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@example.com</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center space-x-4">
              <MessageCircle className="h-6 w-6" />
              <div>
                <h3 className="font-medium">Discord Community</h3>
                <p className="text-sm text-muted-foreground">Join our Discord server</p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs?.map((faq) => (
                <AccordionItem value={faq.id} key={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}