
import { useState } from "react"
import ChoosedCity from "./ChoosedCity"

export default function CountrySearch({
  countryPlaceHolder,
  setCountryPlaceHolder,
  choosedCountry,
  setChoosedCountry,
  searchShow,
  setSearchShow,
  countries,
  setCountries,
  countryInput,
  activeCountryList,
  setActiveCountryList,
  choosedRegion,
  setChoosedRegion,
}) {

  const handleShowCountryList = () => {
    setActiveCountryList(activeCountryList => !activeCountryList)
    }

  const handleChooseThisCountry = (e) => {
    let Country = e.target.getAttribute ('name')
    setActiveCountryList(activeCountryList => !activeCountryList)

    if(choosedCountry.length >= 0){
      setCountryPlaceHolder("")

    }
    
    setChoosedCountry(current => [...current, Country])
    setCountries(countries.map(country => {
      if((country.name === Country) && (country.OnList !== "deactive")) {
      return {
        ...country, added: true,
        OnList: false,
        regionList:true
      }
    } 
    if((country.name === Country) && (country.OnList === "deactive")) {
      return {
        ...country, regionList:true
      }
    }else return {...country}
    }))
  }

  let ActualCountiresList = countries.filter(country => country.OnList === true)


  return (
    <>
    <div className="InputsStyle">
      <input onClick={handleShowCountryList} className="InputsProps" autoComplete="off" name="" placeholder="Miasto"></input>
    </div>
    {activeCountryList && <div className="ListWithChooseContainer">{ActualCountiresList.map(country => 
      <li key={country}
        className="listToChoose"
        name={country.name}
        onClick={handleChooseThisCountry}>{country.name}</li>)}</div>}
      </>
  )
}
