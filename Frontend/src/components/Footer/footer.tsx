import { Separator } from "@/components/ui/separator";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      {
        title: "How it works",
        href: "#",
      },
      {
        title: "Features",
        href: "#",
      },
      {
        title: "Comparisons",
        href: "#",
      },
    ],
  },
  {
    title: "About",
    links: [
      {
        title: "About us",
        href: "#",
      },
      {
        title: "Team",
        href: "#",
      },

      {
        title: "Contact",
        href: "#",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "Help Center",
        href: "#",
      },
      {
        title: "FAQs",
        href: "#",
      },
      {
        title: "Support",
        href: "#",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        title: "Terms",
        href: "#",
      },
      {
        title: "Privacy",
        href: "#",
      },
      {
        title: "Cookies",
        href: "#",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-background">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-10 px-6 xl:px-0">
          <div className="col-span-full xl:col-span-2">
            {/* Logo */}
            <div className="text-2xl font-bold">FindCheap</div>

            <p className="mt-4 text-muted-foreground">
              Find the best deals online and save money on your purchases.
              Compare prices across top retailers and make smarter shopping
              decisions.
            </p>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className="font-semibold">{title}</h6>
              <ul className="mt-6 space-y-4">
                {links.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" target="_blank">
              FindCheap
            </Link>
            . All rights reserved.
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <Link href="https://x.com/Adarsh13673751" target="_blank">
              <TwitterIcon className="h-5 w-5" />
            </Link>
            <Link href="https://www.linkedin.com/in/adarsh30" target="_blank">
              <LinkedinIcon className="h-5 w-5" />
            </Link>
            <Link href="https://github.com/AdarsHH30" target="_blank">
              <GithubIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
