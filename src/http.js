//Default http method for fetch method is GET

//GET
export async function fetchAvailablePlaces(){
    const res= await fetch('http://localhost:3000/places');
        const resData= await res.json();
        if(!res.ok){
            throw new Error('failed to fetch');
        }
    return resData.places;
}

//POST
export async function updateUserPlaces(places){
    const res= await fetch('http://localhost:3000/user-places',{
        method: 'PUT',
        body: JSON.stringify({places}),
        headers: {'Content-Type': 'application/json'}
    });
    const resData= await res.json();
    if(!res.ok){
        throw new Error('failed to update user places');
    }
    return resData.message;
}

//fetch stored places
export async function fetchUserPlaces(){
    const res= await fetch('http://localhost:3000/user-places');
        const resData= await res.json();
        if(!res.ok){
            throw new Error('failed to fetch user places');
        }
    return resData.places;
}
