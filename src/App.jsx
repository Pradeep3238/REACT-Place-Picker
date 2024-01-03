import { useRef, useState, useCallback, useEffect } from 'react';

import Error from './components/Error.jsx';
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updateUserPlaces,fetchUserPlaces } from './http.js';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const[errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isFetching,setIsFetching] = useState(false);
  const [ error,setError] = useState();

  useEffect(()=>{
    async function fetchPlaces(){
      setIsFetching(true);
      try{
        const places = await fetchUserPlaces();
          setUserPlaces(places);
      }catch(error){
          setError({
            message:error.message || " Couldn't fetch user places" 
          });
      }
      setIsFetching(false);
    } 
    fetchPlaces();   
  },[])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }
  //chsange the method to async as it may take some time to store on the server
  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    //update the selected places in the server
    try{
      await updateUserPlaces([selectedPlace,...userPlaces]);
    }catch(error){
        // setUserPlaces(userPlaces); // if we do like this, UX is not so apealing...

        //thus handle error state
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({
          messge: error.messge || 'Error updating user'
        });
    }

  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try{
        await updateUserPlaces(
          userPlaces.filter((place)=> place.id !== selectedPlace.current.id));
    }
    catch(error){
      setUserPlaces(userPlaces); //setting the userPlaces back to its previous places
      setErrorUpdatingPlaces({
        message : error.message || 'error deleting the places'
      })
    }
    setModalIsOpen(false);
  }, [userPlaces]); //pass the serplaces as a dependency as it depends on what places are shon in the selected block

  function handleError(){
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {/* condition render the error as error maynot occur  */}
        {errorUpdatingPlaces && <Error
          title='Error updating user'
          message={errorUpdatingPlaces.message}
          onConfirm={handleError}  
        />}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        
        {error && <Error title='An Error Occured' message={error.message}/>}
        
        {!error && (<Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          isLoading={isFetching}
          loadingText='loading...'
          onSelectPlace={handleStartRemovePlace}
        />)}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
