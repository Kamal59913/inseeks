import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 21 20"
    {...props}
  >
    <path
      fill="currentColor"
      d="M19.95 9h-8.4V1c0-.552-.47-1-1.05-1S9.45.448 9.45 1v8h-8.4C.47 9 0 9.448 0 10s.47 1 1.05 1h8.4v8c0 .552.47 1 1.05 1s1.05-.448 1.05-1v-8h8.4c.58 0 1.05-.448 1.05-1s-.47-1-1.05-1"
    />
  </svg>
);
const Memo = memo(SvgPlus);
export default Memo;
