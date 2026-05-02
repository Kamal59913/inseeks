import localFont from 'next/font/local';
const satoshi = localFont({
  src: 
   [
    { path: './font/Satoshi-Regular.woff', weight: '400', style: 'normal' },
    { path: './font/Satoshi-Medium.woff', weight: '500', style: 'normal' },
    { path: './font/Satoshi-Bold.woff', weight: '700', style: 'normal' },
    { path: './font/Satoshi-Italic.woff', weight: '400', style: 'italic' },
  ],
  variable: '--font-satoshi',
});

export default satoshi;
