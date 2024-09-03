import Mainview from "../../components/mainview";
import Whyinvestorstay from "../../components/whyinvestorstay";
import Howlooksinvestorstay from "../../components/howlooksinvestorstay";
import Decision from "../../components/decision";
import Model from "../../components/model";
import Firstmiddleview from "../../components/firstmiddleview";
import Secondmiddleview from "../../components/secondmiddleview";
import Contactform from "../../components/contactfrom/contactform";
import Whyonesta from "../../components/whyonesta";
import Header from "@/components/Header";
import { WorkSans } from "../../fonts/fonts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className={`${WorkSans.className} w-full`}>
      <Header />
      <Mainview />
      <div className="md:w-[1000px] mx-auto">
        <Whyinvestorstay />
        <Firstmiddleview />
        <Howlooksinvestorstay />
        <Secondmiddleview />
        <Decision />
        <Contactform />
        <Model />
        <Whyonesta />
        <Contactform />
      </div>
      <Footer />
    </main>
  );
}
