"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How accurate are the prices on FindCheap?",
      answer:
        "Our prices are updated in real-time from retailer APIs and verified multiple times per day. We maintain 99.5% accuracy across all our partner retailers. If you find a discrepancy, please report it and we'll update it immediately.",
    },
    {
      question: "Do I need to pay to use FindCheap?",
      answer:
        "FindCheap is completely free for consumers! We earn commission from retailers when you make purchases through our links, but this never affects the prices you pay. In fact, we often negotiate exclusive discounts for our users.",
    },
    {
      question: "How often are deals and prices updated?",
      answer:
        "Prices are updated every 15 minutes for most products, and every 5 minutes for high-demand items. Flash sales and limited-time offers are updated in real-time. We also send instant notifications for price drops on your wishlist items.",
    },
    {
      question: "Is it safe to purchase through FindCheap?",
      answer:
        "Absolutely! We only partner with verified, reputable retailers. When you click to purchase, you're taken directly to the retailer's official website. We never store your payment information, and all transactions are secured by the retailer's own security systems.",
    },
    {
      question: "What if I find a lower price elsewhere?",
      answer:
        "If you find a legitimate lower price that we've missed, please report it to us! We continuously improve our price tracking algorithms and appreciate user feedback. We'll also investigate and update our records accordingly.",
    },
    {
      question: "Can I track price history for products?",
      answer:
        "Yes! Premium users can access detailed price history charts, set price alerts, and get notifications when prices drop. This helps you make informed decisions about when to buy and identify genuine sales vs. fake discounts.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Got questions? We've got answers! Here are the most common questions
            about FindCheap.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/20 transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 group"
              >
                <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-primary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <div className="h-px bg-border mb-4" />
                      <p className="text-foreground/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-foreground/70 mb-4">Still have questions?</p>
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
