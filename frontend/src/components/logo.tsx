"use client";
import React from "react";
import Image from "next/image";

export default function logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 md:w-14 md:h-14">
        <Image
          src="/images/pink.png"
          alt="POLADC Logo"
          width={56}
          height={56}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl md:text-2xl font-bold text-pink-600">
          POLA<span className="text-pink-500">DC</span>
        </span>
        <span className="text-[9px] md:text-[10px] font-medium text-pink-500 tracking-wider">DENTAL CLINIC</span>
      </div>
    </div>
  );
}
