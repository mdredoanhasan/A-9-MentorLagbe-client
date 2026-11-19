import Hero from "./components/hero";
import HowItWorks from "./components/how-it-work";
import PricingFaq from "./components/PricingFaq";
import PricingPage from "./components/pro-plan";
import Subjects from "./components/subjects";

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <Subjects/>
      <HowItWorks />
      <PricingPage />
      <PricingFaq/>
    </div>
  );
}
