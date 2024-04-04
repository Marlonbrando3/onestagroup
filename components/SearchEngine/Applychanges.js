import React from 'react'

export default function Applychanges({apply, setApply, setShowSearchComponentsOnMobile}) {

  const handleChange = () => {
    setApply(false)
    setShowSearchComponentsOnMobile(showSearchComponentsOnMobile => false)
  }

  return (
    <div className={apply ? 'z-40 md:border-2 md:border-red-600 md:bg-white rounded-md fixed flex justify-center items-center inset-x-1 lg:inset-x-1/3 lg:top-20 lg:bottom-auto bottom-1 transition-all duration-200' : 'z-40 border-4 border-red-600 bg-white rounded-xl fixed flex justify-center items-center inset-x-1/3 -top-60 transition-all duration-200'}>
          <div className='md:px-2 md:block hidden'>Po wprowadzeniu wszystkich kryterów</div>
          <div onClick={handleChange} className='px-2 w-full md:w-auto py-1 my-2 bg-green-600 text-white text-center rounded-md cursor-pointer'>Zatwierdź <span className='md:hidden'>zmiany</span></div>
    </div>
  )
}
