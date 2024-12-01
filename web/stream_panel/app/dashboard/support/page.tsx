'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, MessageCircle, Book, Github } from 'lucide-react';

export default function SupportPage() {
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
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  To get started, simply sign up for an account and follow our quick setup guide. 
                  You'll be streaming in no time!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What are the system requirements?</AccordionTrigger>
                <AccordionContent>
                  Our application is designed to work on most modern systems. We recommend:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Windows 10/11 or macOS 10.15+</li>
                    <li>4GB RAM minimum</li>
                    <li>Stable internet connection</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I configure stream settings?</AccordionTrigger>
                <AccordionContent>
                  Stream settings can be configured in the dashboard under the Settings tab. 
                  You can adjust quality, bitrate, and other streaming parameters there.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Is there a limit to streaming time?</AccordionTrigger>
                <AccordionContent>
                  Streaming limits depend on your subscription plan. Free users have basic limits,
                  while premium users enjoy unlimited streaming capabilities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-8 flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={() => window.open('/docs', '_blank')}>
                <Book className="mr-2 h-4 w-4" />
                Documentation
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.open('https://github.com/your-repo', '_blank')}>
                <Github className="mr-2 h-4 w-4" />
                GitHub Repository
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}