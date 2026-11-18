import Hero from "./components/hero";
import HowItWorks from "./components/how-it-work";
import Navbar from "./components/navbar";


export default function Home() {
  return <div>
    <Navbar></Navbar>
    <Hero></Hero>
    <HowItWorks/>
  </div>;
}
