import { XIcon } from '@heroicons/react/outline'

export default function ChoosedCountry({
  countryPlaceHolder,
  setCountryPlaceHolder,
  choosedCountry,
  setChoosedCountry,
  countries,
  setCountries,
  activeCountryList,
  setActiveCountryList,
  choosedRegion,
  setChoosedRegion,
}) {

  const handleDeleteCountryFromList = (e) => {
    
    let Country = e.target.getAttribute('name')
    setCountries(countries.map(country => {
      if((country.name === Country) && (country.OnList !== "deactive")){
      return {
        ...country, added: false,
        OnList: true,
        regionList: false
      }
    } if(country.name === Country) {
      return{
          ...country, regionList: false
      }
    }
    
    else return {...country}
    }))
    

    if(choosedCountry.length >= 0 && choosedCountry.length < 2){
      setCountryPlaceHolder("Wybierz Kraj (mozesz kilka)")
    }

    setChoosedCountry(choosedCountry.filter(country => country !== Country))
  }


  return (
    <div className="">
      {/* <div className='flex items-center justify-center'>
        {choosedCountry.map(country => 
          <>
            <div className='flex items-center border-black border-b ml-1'>{country}
            <XIcon 
                className=" text-gray-900 cursor-pointer"
                onClick={handleDeleteCountryFromList}
                name={country}
                width={20}
                height={20}
            />
            </div>
          </>
          )}
    </div> */}
    </div>
  )
}
