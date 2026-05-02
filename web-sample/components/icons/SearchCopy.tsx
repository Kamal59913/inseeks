import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgSearchCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#777"
      fillRule="evenodd"
      d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14m-9 7a9 9 0 1 1 18 0 9 9 0 0 1-18 0"
      clipRule="evenodd"
    />
    <path
      fill="#777"
      fillRule="evenodd"
      d="M15.943 15.943a1 1 0 0 1 1.414 0l4.35 4.35a1 1 0 0 1-1.414 1.414l-4.35-4.35a1 1 0 0 1 0-1.414"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgSearchCopy);
export default Memo;
