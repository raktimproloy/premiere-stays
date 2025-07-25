import Image from "next/image";
import Link from "next/link";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeroSection from "@/components/home/HeroSection";
import TrustedPartners from "@/components/home/TrustedPartners";
import AboutUs from "@/components/home/AboutUs";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServicesSection from "@/components/home/ServicesSection";
import Properties from "@/components/home/Properties";
import ReviewsSection from "@/components/home/Reviews";
import FaqSection from "@/components/home/FaqSection";
import WorkRating from "@/components/common/WorkRating";
 
export default function Home() {
  return (
    <DefaultLayout>
      <HeroSection />
      <TrustedPartners />
      <AboutUs />
      <FeaturesSection />
      <ServicesSection />
      <WorkRating />
      <Properties />
      <ReviewsSection />
      <FaqSection />
    </DefaultLayout>
  );
}
