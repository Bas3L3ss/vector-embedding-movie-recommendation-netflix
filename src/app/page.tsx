import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MonitorPlay,
  Download,
  FileMusic as DeviceMobile,
  Award,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

const NetflixLandingPage = async () => {
  const user = (await (await createClient()).auth.getUser()).data.user?.id;
  if (user) {
    redirect("/home");
  }

  const features = [
    {
      title: "Enjoy on your TV",
      description:
        "Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
      icon: <MonitorPlay className="w-12 h-12 text-red-600" />,
    },
    {
      title: "Download your shows",
      description:
        "Save your favorites easily and always have something to watch.",
      icon: <Download className="w-12 h-12 text-red-600" />,
    },
    {
      title: "Watch everywhere",
      description:
        "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
      icon: <DeviceMobile className="w-12 h-12 text-red-600" />,
    },
    {
      title: "Award-winning content",
      description:
        "Enjoy exclusive Netflix originals, movies, TV shows, documentaries, and more.",
      icon: <Award className="w-12 h-12 text-red-600" />,
    },
  ];

  const faqs = [
    {
      question: "What is Netflix?",
      answer:
        "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    },
    {
      question: "How much does Netflix cost?",
      answer:
        "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $6.99 to $19.99 a month.",
    },
    {
      question: "Where can I watch?",
      answer:
        "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device.",
    },
    {
      question: "How do I cancel?",
      answer:
        "Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks.",
    },
  ];

  return (
    <div className="min-h-screen   text-white  ">
      {/* Hero Section */}

      <div className="relative h-[85vh] flex items-center justify-center z-0">
        <div className="text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="text-2xl mb-6">Watch anywhere. Cancel anytime.</p>
          <p className="text-xl mb-6">
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Email address"
              className="px-4 py-3 bg-black/40 border border-gray-600 rounded text-white w-full sm:w-96"
            />
            <Button
              size="lg"
              variant="destructive"
              className="flex items-center"
            >
              Get Started <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
        <div className="bg-black/20 size-full absolute  -z-9"></div>
        <div className="absolute inset-0 -z-10">
          <Image
            src="/netflix-bg.jpg"
            alt="Netflix Background"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
            className="object-cover"
            quality={90}
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center  flex flex-col items-center p-6"
              >
                {feature.icon}
                <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-zinc-800"
              >
                <AccordionTrigger className="px-6 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-12">
            <p className="text-lg mb-6">
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Email address"
                className="px-4 py-3 bg-black/40 border border-gray-600 rounded text-white w-full sm:w-96"
              />
              <Button
                size="lg"
                variant="destructive"
                className="flex items-center"
              >
                Get Started <ChevronRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetflixLandingPage;
