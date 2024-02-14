import Footer from "@/components/Footer";
import Forms from "@/components/Forms";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Numbers from "@/components/Numbers";
import Operation from "@/components/Operation";
import OperationSlider from "@/components/OperationSlider";
import Planet from "@/components/Planet";
import Section3 from "@/components/Section3";
import LandingPrice from "@/components/LandingPrice";
import Cookies from "@/components/Cookies";

export default async function Home() {
  return (
    <>
      <Cookies />
      <div className="">
        <Header />
      </div>

      <div className="flex-cols justify-content ">
        <HeroSection />
      </div>

      <div>
        <Numbers />
      </div>

      <div className="max-sm:hidden ">
        <Operation />
      </div>
      <div className="sm:hidden ">
        <OperationSlider />
      </div>

      <div className="flex justify-center">
        <Section3 />
      </div>

      <div className="flex justify-center ">
        <Planet />
      </div>

      <LandingPrice />

      <div className="">
        <Forms />
      </div>

      <div className="">
        <Footer />
      </div>
    </>
  );
}
