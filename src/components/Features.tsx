import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FaDollarSign } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";
import { FaRegHandshake } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "./Footer";

export default function Feature() {
  return (
    <div className="bg-[#030303]">
      {/* Case Studies Section */}
      <div className="min-h-[50vh] flex flex-col bg-gradient-to-b from-[#030303] to-[#000000]">
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Case Studies
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
              You will have a trusted partner by your side every step of the way.
            </p>
          </div>
        </main>
      </div>

      {/* Feature Cards */}
      <div className="flex items-center justify-center p-6 -mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
          {cardData.map((card, index) => (
            <Card
              key={index}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-lg rounded-lg"
            >
              <div
                className={`absolute inset-0 ${card.gradient} blur-xl opacity-30 pointer-events-none`}
              ></div>
              <div className="relative z-10 bg-[#1a1a1a] backdrop-blur-md rounded-lg p-4 md:p-6">
                {card.icon}
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 md:pt-4">
                  <p className="text-gray-300 text-sm md:text-base">
                    {card.content}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-gradient-to-b from-[#030303] via-[#300727] to-[#770c50]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* FAQ Header */}
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tight">
                FAQ's
              </h2>
              <p className="text-base md:text-lg text-gray-400">
                👋 How can we help today?
              </p>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-base md:text-lg font-semibold text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const cardData = [
  {
    title: "Increase Content efficiency",
    content:
      "Streamline your marketing efforts and maximize ROI with our data-driven strategies and automation tools. Let us help you reach your target audience and grow your Youtube channel.",
    gradient: "bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600",
    icon: <FaDollarSign className="text-3xl md:text-4xl text-white" />,
  },
  {
    title: "Content that viewers love",
    content:
      "Create engaging, high-quality content that resonates with your target audience and keeps them coming back for more. By identifying what works best for you and your audience, you can craft the perfect content.",
    gradient: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
    icon: <BsGraphUpArrow className="text-3xl md:text-4xl text-white" />,
  },
  {
    title: "Constant iteration",
    content:
      "Stay ahead of the curve with our agile approach, continuously improving and adapting to market trends and customer feedback.",
    gradient: "bg-gradient-to-br from-green-500 via-teal-500 to-blue-500",
    icon: <FiMessageSquare className="text-3xl md:text-4xl text-white" />,
  },
  {
    title: "Proven experience",
    content:
      "We know what we are doing with the help of AI to create and use the correct tags and keywords to get more views and subscribers.",
    gradient: "bg-gradient-to-br from-orange-500 via-yellow-500 to-red-500",
    icon: <FaRegHandshake className="text-3xl md:text-4xl text-white" />,
  },
];

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We offer a wide range of services designed to maximize your YouTube channel's potential.",
  },
  {
    question: "How can it help?",
    answer:
      " It helps you gain more views and subscribers by optimizing your content and tags.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes, we offer various support and maintenance packages to ensure your website or application continues to run smoothly after launch.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "Our pricing is project-based and depends on the specific requirements. We provide detailed quotes after an initial consultation to understand your needs.",
  },
];
