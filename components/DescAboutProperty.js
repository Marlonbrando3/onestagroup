import React from 'react'

export default function DescAboutProperty({description, bedrooms, bathrooms, distance, pool}) {

  let poolCnv = '';

  if(pool === true){
    poolCnv = 'Tak'
  }
  else poolCnv = "Nie"

  return (
    <div className='pt-5'>
      <p>- Sypialnie: {bedrooms}</p>
      <p>- Łazienki: {bathrooms}</p>
      <p>- Dystans do morza: {distance} metrów</p>
      <p>- Basen: {poolCnv}</p>
    </div>
  )
}
