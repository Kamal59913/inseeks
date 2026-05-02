// import { ReactNode } from "react";
// import { Link } from "react-router";
// import { useNavigate } from "react-router-dom";

// interface BreadcrumbProps {
//   pageTitle: string;
//   destination_name?: string;
//   destination_path?: string;
//   is_reverse?: boolean;
//   footerContent?: ReactNode;
//   backButtonText?: string;
// }

// const PageBreadcrumbButton: React.FC<BreadcrumbProps> = ({
//   pageTitle,
//   destination_name,
//   destination_path,
//   is_reverse,
//   footerContent,
//   backButtonText = "Back"
// }) => {
//   const navigate = useNavigate();

//   const handleBackClick = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//       {/* Back Button */}
//       <button
//         onClick={handleBackClick}
//         className="back-btn inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black dark:bg-black black-text dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
//       >
//         <svg
//           className="w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//         {backButtonText}
//       </button>

//       {/* Original Breadcrumb Content */}
//       <div className="flex-1">
//         {is_reverse ? (
//           <>
//             <nav>
//               <ol className="flex items-center gap-1.5">
//                 <li>
//                   <Link
//                     className="inline-flex items-center gap-1.5 primary-breadcrumb-text text-gray-500 black-text"
//                     to={`${destination_path ? `/${destination_path}` : "/"}`}
//                   >
//                     {destination_name ? <>{destination_name}</> : "Home"}
//                     <svg
//                       className="stroke-current"
//                       width="17"
//                       height="16"
//                       viewBox="0 0 17 16"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
//                         stroke=""
//                         strokeWidth="1.2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </Link>
//                 </li>
//                 <li className="primary-breadcrumb-text text-black dark:text-white/90">
//                   {pageTitle}
//                 </li>
//               </ol>
//             </nav>

//             {footerContent && (
//               <div className="ml-auto">
//                 {footerContent}
//               </div>
//             )}
//             <h2
//               className="text-xl font-semibold text-black dark:text-white/90"
//               x-text="pageName"
//             >
//               {/* {footerContent && footerContent} */}
//               {/* {pageTitle} */}
//             </h2>
//           </>
//         ) : (
//           <>
//             <h2
//               className="text-xl font-semibold text-black dark:text-white/90"
//               x-text="pageName"
//             >
//               {footerContent && footerContent}
//               {/* {pageTitle} */}
//             </h2>
//             <nav>
//               <ol className="flex items-center gap-1.5">
//                 <li>
//                   <Link
//                     className="inline-flex items-center gap-1.5 text-sm text-gray-500 black-text"
//                     to={`${destination_path ? `/${destination_path}` : "/"}`}
//                   >
//                     {destination_name ? <>{destination_name}</> : "Home"}
//                     <svg
//                       className="stroke-current"
//                       width="17"
//                       height="16"
//                       viewBox="0 0 17 16"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
//                         stroke=""
//                         strokeWidth="1.2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </Link>
//                 </li>
//                 <li className="text-sm text-black dark:text-white/90">
//                   {pageTitle}
//                 </li>
//               </ol>
//             </nav>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PageBreadcrumbButton;