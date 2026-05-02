import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgThreeLineMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 29 23"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M0 1.607A1.607 1.607 0 0 1 1.607 0h25.714a1.607 1.607 0 1 1 0 3.214H1.607A1.607 1.607 0 0 1 0 1.607m0 9.643a1.607 1.607 0 0 1 1.607-1.607H17.68a1.607 1.607 0 0 1 0 3.214H1.607A1.607 1.607 0 0 1 0 11.25m0 9.643a1.607 1.607 0 0 1 1.607-1.607h8.036a1.607 1.607 0 1 1 0 3.214H1.607A1.607 1.607 0 0 1 0 20.893"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgThreeLineMenu);
export default Memo;
