import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgNotificationFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 21 24"
    {...props}
  >
    <path
      fill="#FCFCFC"
      d="m19.5 16.463-1.394-1.42a1.05 1.05 0 0 1-.302-.74v-4.295c0-3.468-2.315-6.405-5.481-7.347A2.23 2.23 0 0 0 10.14 0a2.23 2.23 0 0 0-2.185 2.662c-3.165.942-5.48 3.878-5.48 7.346v4.296c0 .278-.107.54-.302.739L.78 16.463a2.655 2.655 0 0 0-.562 2.932 2.655 2.655 0 0 0 2.485 1.652h4.11A3.356 3.356 0 0 0 10.14 24a3.356 3.356 0 0 0 3.327-2.953h4.11a2.655 2.655 0 0 0 2.486-1.652 2.655 2.655 0 0 0-.562-2.932"
    />
  </svg>
);
const Memo = memo(SvgNotificationFilled);
export default Memo;
