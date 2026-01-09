import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I open a new account?",
      answer: "You can open a new account by logging into your dashboard and navigating to the Accounts section. Click on 'Create Account' and follow the simple steps to set up your checking, savings, or business account."
    },
    {
      question: "What are the transaction limits?",
      answer: "Transaction limits vary by account type. Standard accounts have a daily transfer limit of $10,000, while premium accounts can transfer up to $50,000 per day. You can view and request limit increases from your account settings."
    },
    {
      question: "How long do transfers take?",
      answer: "Internal transfers between your accounts are instant. Transfers to other banks typically take 1-3 business days. International transfers may take 3-5 business days depending on the destination country."
    },
    {
      question: "Is my money safe?",
      answer: "Yes, your deposits are FDIC insured up to $250,000 per depositor. We use bank-level encryption and multi-factor authentication to protect your account. Our security measures include 24/7 fraud monitoring and advanced threat detection."
    },
    
    {
      question: "Can I schedule recurring transfers?",
      answer: "Yes, you can set up recurring transfers from the Transfer page. Select the 'Schedule' option, choose your frequency (weekly, bi-weekly, or monthly), and set the amount. You can modify or cancel scheduled transfers at any time."
    },
    
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a secure link to reset your password. For security reasons, password reset links expire after 24 hours."
    },
    {
      question: "Are there any monthly fees?",
      answer: "Our basic checking account has no monthly fees. Premium accounts have a $15 monthly fee but it's waived if you maintain a minimum balance of $5,000 or set up direct deposit. Savings accounts are always free."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team 24/7 through the Contact Support page, by phone at 1-800-BANK-NOW, via live chat in your dashboard, or by email at support@bankapp.com. We typically respond within 2 hours."
    }
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-background">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Find answers to common questions about our banking services. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-card rounded-lg border p-4 sm:p-6 mb-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 sm:px-6">
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support CTA */}
        <div className="bg-primary/5 rounded-lg border border-primary/20 p-6 sm:p-8 text-center space-y-4">
          <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-primary" />
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">Still have questions?</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Our support team is here to help you 24/7
            </p>
          </div>
          <Button 
            onClick={() => navigate("/support")}
            className="gap-2"
            size="lg"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
};

export default FAQ;
