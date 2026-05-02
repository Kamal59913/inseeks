import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgArrowPlane = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#FCFCFC"
      fillRule="evenodd"
      d="M.346.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.21L2.614 11h5.387a1 1 0 0 0 0-2H2.614L.051 1.316A1 1 0 0 1 .346.246"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgArrowPlane);
export default Memo;
