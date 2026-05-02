"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@repo/ui/index";
import { Separator } from "@repo/ui/index";

export function SocialLoginButtons() {
  return (
    <>
      <div className="flex justify-center items-center mb-4">
        <Button variant="outline" className="border-0 shadow-none">
          <Image src="/google.svg" alt="Google" width={40} height={40} />
        </Button>
        <Button variant="outline" className="border-0 shadow-none">
          <Image src="/apple.svg" alt="Apple" width={40} height={40} />
        </Button>
      </div>
      
      <div className="flex items-center mt-5 mb-3">
        <Separator className="flex-1 bg-gray-200" />
        <span className="px-4 text-gray-500 text-xs font-semibold">OR</span>
        <Separator className="flex-1 bg-gray-200" />
      </div>
    </>
  );
}
