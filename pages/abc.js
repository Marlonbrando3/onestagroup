import Script from "next/script";
import { useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import MiniHomeView from "../components/SearchEngine/MiniHomeView";
import Abc from "../data/Abc.json";
import AnalitycsTools from "@/analitycs/analitycsTools";

export default function ABC() {
  const chosed = useRef([]);
  const icon = useRef([]);

  console.log(chosed);

  const ShowThisQuestion = (index) => {
    console.log(index + 1);
    let text = Math.ceil(
      chosed.current[index].innerHTML.toString().length / 45
    );
    console.log(text);
    Abc.map((evt) => {
      if (evt.id === index + 1) {
        if (chosed.current[evt.id - 1].style.height !== text * 30 + "px") {
          chosed.current[evt.id - 1].style.height = text * 30 + "px";
          chosed.current[evt.id - 1].style.transition = "0.3s";
          icon.current[evt.id - 1].style.rotate = "180deg";
        } else {
          chosed.current[evt.id - 1].style.height = "0px";
          icon.current[evt.id - 1].style.rotate = "0deg";
        }
      } else {
        chosed.current[evt.id - 1].style.height = "0px";
        icon.current[evt.id - 1].style.rotate = "0deg";
      }
      return;
    });
  };

  return (
    <div>
      <AnalitycsTools />
      <Head>
        <title>ABC Inwestowania - Onesta Group</title>
        <link rel="shortcut icon" href="/logotype.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
      </Head>
      <Header />
      <MiniHomeView />
      <div className="lg:w-10/12 w-12/12 mx-auto md:p-3 p-auto">
        {Abc.map((obj, index) => (
          <div
            key={obj}
            onClick={() => ShowThisQuestion(index)}
            className="bg-white lg:w-2/3 p-3 overflow-hidden pl-8 mx-auto my-2 cursor-pointer flex items-start justify-start w-full border-2 border-red-600"
          >
            <div
              ref={(el) => (icon.current[index] = el)}
              className="mt-2 duration-100 rotate-45 border-t-4 border-l-4 border-gray-900 w-[12px] h-[12px] mr-5"
            ></div>
            <div className="w-11/12 h-full">
              <div className="font-semibold">{obj.question}</div>
              <div
                className="h-0 overflow-hidden"
                ref={(el) => (chosed.current[index] = el)}
              >
                {obj.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
