import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import {sortPlacesByDistance} from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {

  const [availablePlaces,setAvailablePlaces] = useState([]); //data state
  const [isFetching,setIsFetching] = useState(false);
  const [ error,setError] = useState();
  // useEffect(()=>{
  //   fetch('http://localhost:3000/places')
  //   .then((res)=> {return res.json();})
  //   .then((data) => setAvailablePlaces(data.places))
  // },[]);

  //using async/await
  useEffect(()=>{ async function handleFetch(){
    setIsFetching(true); // starting to load 
    try{
        const places=await fetchAvailablePlaces(); //the fetchiing question is outsourced to seperate file for more liner code.
        //await is used as the fetchAvailablePlaces is an async function and it may need some time to fetch the data
        navigator.geolocation.getCurrentPosition((position)=>{
            const sortedPlaces = sortPlacesByDistance(places,position.coords.latitude,position.coords.longitude);
            setAvailablePlaces(sortedPlaces);
            setIsFetching(false); //finished loading
          })
    }
    catch(error){
        setError({
          message: error.message || 'An error occurred while fetching'
        }) 
             setIsFetching(false); //finished loading
    }
    }
    handleFetch();
  },[]);

  if (error){
    return(
      <Error title='An Error occured' message={error.message}/>
    )
  }

  return (
    <Places
      title="Available Places"
      isLoading={isFetching}
      loadingText='fetching data...'
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
