import Navbar from "@/app/components/NavBar";
import Hero from "@/app/components/Hero";
import TeacherSection from "@/app/components/TeachersSection";
import StudentSection from "@/app/components/StudentsSection";
import HowItWorks from "@/app/components/HowItWorks";

import Pricing from "@/app/components/Pricing";
import CTA from "@/app/components/CTASection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TeacherSection />
      <StudentSection />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}