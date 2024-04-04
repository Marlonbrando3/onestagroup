import { useEffect,useState, useContext, useRef } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { AppContext } from "../../../pages/_app"
import { SearchEngineContext } from '../SearchEngine'
import { SearchComponentsContext } from "../SearchComponentsList";


export default function Searange({}
) {
  const RangeRef = useRef();
  const RangeRefVis = useRef();
  const [current, setValue] = useState(2000);
  const {searchConditions, setSearchConditions} = useContext(AppContext)
  const {applySea, setApplySea} = useContext(SearchEngineContext)
  const {ShowChangedAreApply} = useContext(SearchComponentsContext)

  let distanceActual = [];

  searchConditions.map(obj =>{
    if(obj.name ==='distance'){
      if(obj.value !== '') {
        distanceActual = [obj.value]
      } else {
        distanceActual = [];
      }
    }})
  
  const handleChangeMax = (e) =>{
    setValue(parseInt(e.target.value))
    setApplySea(true)
  }

  const hideAppyButton = (e) => {

    ShowChangedAreApply()

    setSearchConditions(searchConditions.map(param => {
      if(param.name === 'distance'){
          return{
            ...param,
            isSearching: true,
            value: current
        }} else return {...param}
      })) 

      setApplySea(false)
    }

  const resetFilters = () => {

    ShowChangedAreApply()
    setSearchConditions(searchConditions.map(param => {
      if(param.name === 'distance'){
          return{
            ...param,
            isSearching: false,
            value: ''
          }
        } else return {...param}
    })) 
  }

  return (
    <>
        {applySea && <div onClick={hideAppyButton} className="applyButton">Zatwierdź</div>}
        {distanceActual.map(obj => (
        <div key={obj} onClick={resetFilters} className="choosed-multiple-option-beds">Dystans: {obj} m / {obj/1000} km <CloseIcon className="close-icon" /></div>
      )) }
      <div className="InputsStyle flex-col items-end">
        <input ref={RangeRef} type="range" onChange={handleChangeMax} start="20000" step="100" max="50000" className="InputsProp appearance-none outline-none rounded-md bg-orange-500 h-1 w-full my-2 cursor-pointer" autoComplete="off" name="" placeholder="Do"></input>
        <div ref={RangeRefVis} className=" w-full h-10 border rounded-md border-gray-900/[0.5] p-1 mt-1">{current} m / {current/1000} km </div>
      </div> 
    </>
  )
}
