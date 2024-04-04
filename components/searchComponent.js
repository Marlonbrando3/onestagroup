import React from 'react'
import SearchIcon from '@mui/icons-material/Search';

export default function searchComponent() {
  return (
    <div className='border bg-white flex h-12 rounded-2xl pl-5 items-center pr-2'>
        <input placeholder="Szukaj na blogu..." className='h-full w-full outline-none'></input>
        <SearchIcon className='cursor-pointer' />
    </div>
  )
}
