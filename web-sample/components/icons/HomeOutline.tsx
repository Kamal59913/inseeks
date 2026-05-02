import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgHomeOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="-1 -1 26 26"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m23.353 10.439-.002-.002-9.79-9.79A2.2 2.2 0 0 0 12 0c-.59 0-1.145.23-1.562.647L.65 10.432l-.01.01a2.21 2.21 0 0 0 .005 3.12 2.2 2.2 0 0 0 1.534.648h.39v7.204A2.59 2.59 0 0 0 5.156 24h3.83a.703.703 0 0 0 .704-.703v-5.649c0-.65.529-1.18 1.18-1.18h2.259c.65 0 1.18.53 1.18 1.18v5.649c0 .388.314.703.702.703h3.83a2.59 2.59 0 0 0 2.587-2.586V14.21h.361a2.213 2.213 0 0 0 1.564-3.77Z"
    />
  </svg>
);
const Memo = memo(SvgHomeOutline);
export default Memo;
