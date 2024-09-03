import Image from "next/image";
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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:w-[1000px] w-full mx-auto">
      <Header />
      <Mainview />
      <Whyinvestorstay />
      <Firstmiddleview />
      <Howlooksinvestorstay />
      <Secondmiddleview />
      <Decision />
      <Contactform />
      <Model />
      <Whyonesta />
      <Contactform />
    </main>
  );
}
