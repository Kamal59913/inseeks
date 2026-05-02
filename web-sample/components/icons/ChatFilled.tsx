import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgChatFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 22 21"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.716 0h4.068c1.371 0 2.447 0 3.311.07.88.073 1.607.221 2.265.557a5.75 5.75 0 0 1 2.513 2.513c.336.658.484 1.385.556 2.265.071.864.071 1.94.071 3.311v1.365c0 1.549 0 2.493-.232 3.287a5.75 5.75 0 0 1-3.9 3.9c-.794.232-1.738.232-3.287.232h-.756a4.25 4.25 0 0 0-2.42.776l-.05.035-2.61 1.865c-1.505 1.074-3.483-.478-2.795-2.194a.35.35 0 0 0-.327-.482h-.601A4.52 4.52 0 0 1 0 12.978V8.716c0-1.371 0-2.447.07-3.311.073-.88.221-1.607.557-2.265A5.75 5.75 0 0 1 3.14.627C3.798.291 4.525.143 5.405.071 6.269 0 7.345 0 8.716 0M6.22 6.22A.75.75 0 0 1 6.75 6h4a.75.75 0 1 1 0 1.5h-4a.75.75 0 0 1-.53-1.28M6.75 10a.75.75 0 1 0 0 1.5h8a.75.75 0 1 0 0-1.5z"
      clipRule="evenodd"
    />
  </svg>
);
const Memo = memo(SvgChatFilled);
export default Memo;
