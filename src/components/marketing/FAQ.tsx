"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homeFaqs as faqs } from "@/lib/faqs";

export function FAQ() {
  return (
    <section id="faq" className="py-32 px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            FAQ
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-black mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-2xl text-neutral-600 max-w-2xl mx-auto font-medium">
            Everything insurance agents ask about AI automation
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="bg-neutral-50 rounded-2xl px-8 border-none"
            >
              <AccordionTrigger className="text-xl font-bold text-black hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-lg text-neutral-600 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
