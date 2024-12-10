import React from "react";

type Text = {
  cont: any;
};

export default function OurJobs({ cont }: Text) {
  return (
    <div className="w-[350px] h-full flex items-center justify-center relative">
      <div className="absolute w-[50px] h-[50px] bg-yellow-500 top-[10px] left-[10px] rounded-[50%] flex items-center justify-center text-[22px] font-bold text-white">
        <p>{cont.id}</p>
      </div>
      <div className="h-[80%] w-[330px] bg-white rounded-xl shadow-xl">
        <p className="text-center text-[22px] font-bold mb-[10px] px-[30px] h-[80px] flex justify-center items-center">
          {cont.title}
        </p>
        <div className="px-[15px]">{cont.description}</div>
      </div>
    </div>
  );
}
