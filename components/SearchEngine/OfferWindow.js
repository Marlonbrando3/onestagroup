// import React from 'react';
// import Image from "next/image";
// import Header from '../Header';
// import {useRouter} from 'next/router'

// export default function OfferWindow({property, showDetails, propDetails, showProp, setShowProp}) {

//   const router = useRouter();

//   const handleCloseDetails = (e) => {
//     setShowProp(setShowProp => !setShowProp)
//   }

//   return (
//     <div className='absolute z-50 w-11/12 bg-white ml-14 p-10'>
//       <div className='absolute bg-white h-10 border-2 border-gray-900 rounded-md right-0 p-2 text-center font-bold cursor-pointer'
//             onClick={handleCloseDetails}>Zamknij ogłoszenie</div>
//     <div>
//         <div className='text-center text-3xl'>{propDetails.title} </div>
//     </div>
//     <div className='flex h-screen w-10/12 mx-auto m-8 bg-red-900 p-3'>
//       <div id="carusel" className='relative w-2/3 h-4/6 bg-yellow-500 overflow-hidden'>
//         {propDetails.image.map(img =>
//         {
//           if((img.visible) === true) {
//             return (
//             <Image key={img}
//               src={img.link}
//               // width={1000}
//               // height={1000}
//               layout="fill"
//             />)
//         }}
//         )}
//         <div className='z-10 w-10 h-10 top-52 absolute bg-gray-900 '></div>
//         <div className='z-10 w-10 h-10 top-52 right-0 absolute bg-gray-900'></div>
//         {/* <img className='w-full h-full reltive border-2 border-gray-900'></img> */}
//         {/* //line of images */}
//       </div>
//       <div id="price-and-props" className="bg-white w-1/3 h-96">
//         <p>Numer oferty: {propDetails.id}</p>
//         <div id="region" className='w-full h-10 border-2 border-gray-900'></div>
//         <div id="region" className='w-full h-10 border-2 border-gray-900'></div>
//       </div>
//       <div></div>

//     </div>
//     </div>
//   )
// }
