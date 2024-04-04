import React from 'react'
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined';
import PoolOutlinedIcon from '@mui/icons-material/PoolOutlined';
import Parking from '@mui/icons-material/DirectionsCar';
import Garden from '@mui/icons-material/LocalFlorist';
import Seaview from '@mui/icons-material/Houseboat';
import Solarium from '@mui/icons-material/SolarPower';

export default function Features() {
  return (
    <div className='flex rounded-md w-full bg-white my-[10px] mx-auto lg:py-4 lg:px-9 p-7 flex-wrap lg:w-10/12 '>
      <span className='flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1'><PoolOutlinedIcon /> <p className='pl-2 text-xl'>Basen</p></span>
      <span className='flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1'><Parking /> <p className='pl-2 text-xl'>Parking</p></span>
      <span className='flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1'><Garden /> <p className='pl-2 text-xl'>Ogród</p></span>
      <span className='flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1'><Solarium /> <p className='pl-2 text-xl'>Taras</p></span>
      <span className='flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1'><WavesOutlinedIcon /> <p className='pl-2 text-xl'>Blisko morza</p></span>
      <span className='flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1'><Seaview /> <p className='pl-2 text-xl'>Widok na morze</p></span>
      <span className='flex lg:w-auto w-1/2 lg:my-8 lg:px-3 py-1'><PoolOutlinedIcon /> <p className='pl-2 text-xl'>Balkon</p></span>
    </div>
  )
}
