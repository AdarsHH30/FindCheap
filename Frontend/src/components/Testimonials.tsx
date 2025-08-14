"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Teacher",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      savings: "$285",
      text: "FindCheap saved me almost $300 on my laptop purchase! I found the same model for 40% less than I was about to pay. This site is a game-changer for budget-conscious shoppers.",
      product: "Gaming Laptop",
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      savings: "$150",
      text: "I've been using FindCheap for months now, and it's incredible how much money I've saved. The price comparison is instant and accurate. Highly recommend!",
      product: "Smartphone",
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      savings: "$420",
      text: "As a business owner, every dollar counts. FindCheap helps me find the best deals on office supplies and equipment. I've saved over $400 this month alone!",
      product: "Office Equipment",
    },
    {
      name: "David Thompson",
      role: "Student",
      avatar: "/api/placeholder/60/60",
      rating: 4,
      savings: "$95",
      text: "Being a student on a tight budget, FindCheap is essential. I found my textbooks and dorm essentials for much less than retail prices. Love this service!",
      product: "Textbooks & Dorm Supplies",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Join thousands of satisfied customers who are saving money every day
            with FindCheap.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/20 group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    -{testimonial.savings}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-foreground/60 text-sm mb-2">
                    {testimonial.role}
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "text-accent fill-current"
                            : "text-muted"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-foreground/70 ml-2">
                      Saved on {testimonial.product}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                <p className="text-foreground/80 leading-relaxed italic pl-6">
                  "{testimonial.text}"
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
