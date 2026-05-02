import * as React from "react";
import type { SVGProps } from "react";
import { memo } from "react";
const SvgFloatCreatePost = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 78 78"
    {...props}
  >
    <g filter="url(#float_create_post_svg__a)">
      <circle
        cx={39}
        cy={39}
        r={31.5}
        fill="#D16DF2"
        stroke="#fff"
        strokeWidth={3}
      />
      <g
        fill="#FCFCFC"
        fillRule="evenodd"
        clipPath="url(#float_create_post_svg__b)"
        clipRule="evenodd"
      >
        <path d="M27 49.649V28.5c0-.827.674-1.501 1.504-1.501h19.632c.83 0 1.504.674 1.504 1.502v9.455a8.3 8.3 0 0 0-1.507-.992V31.53H28.51v16.61h8.452c.275.536.608 1.042.992 1.507z" />
        <path d="M36.057 37.571v-4.533h10.565v4.533zm9.055-1.512v-1.512h-7.545v1.512zm-15.096-1.51v1.508h4.53v-1.509zm0 7.553v1.507h4.53v-1.507z" />
        <path d="M37.567 44.363a6.8 6.8 0 0 1 6.793-6.797 6.797 6.797 0 0 1 0 13.592 6.796 6.796 0 0 1-6.793-6.795m7.546 3.777v-3.02h3.023v-1.508h-3.023v-3.025h-1.508v3.024h-3.019v1.508h3.02v3.02z" />
      </g>
    </g>
    <defs>
      <clipPath id="float_create_post_svg__b">
        <path fill="#fff" d="M27 27h24v24H27z" />
      </clipPath>
      <filter
        id="float_create_post_svg__a"
        width={78}
        height={78}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={3} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1056_45855"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_1056_45855"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
const Memo = memo(SvgFloatCreatePost);
export default Memo;
