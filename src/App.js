import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import Pagination from './Pagination';
import axios from 'axios';

function App() {
  const [ pokemon, setPokemon ] =  useState([]);
  const [ currentPageUrl, setCurrentPageUrl ] = useState("https://pokeapi.co/api/v2/pokemon/")
  const [ previousPageUrl, setPreviousPageUrl ] = useState()
  const [ nextPageUrl, setNextPageUrl ] = useState()
  const [ loading, setLoading ] = useState(true);

  //This 'useEffect()' says everytime the 'currentPageUrl is changed, do the following code. This makes it so that
   //the entire page does not have to reload. It just reacts with this effect on the 'currentPageUrl' is changed.
  useEffect(() => {
    //Each time we make a request, setLoading to true:
    setLoading(true);
    let cancel;
    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      //Complete the request, setLoading to false
      setLoading(false)
      setNextPageUrl(res.data.next)
      setPreviousPageUrl(res.data.previous)
      setPokemon(res.data.results.map(p => p.name)); 
  })
    //This logic deletes all previous requests whenever a request is made to eliminate stack error or having old request finish after new requests.
    //return () => cancel()
  }, [currentPageUrl])

  function goToNextPage(){
    setCurrentPageUrl(nextPageUrl);
  }

  function goToPreviousPage(){
    setCurrentPageUrl(previousPageUrl);
  }

  if(loading) return "Loading..."

  
  return (
    <>
    <PokemonList pokemon={pokemon} />
    <Pagination
      goToNextPage={nextPageUrl ? goToNextPage : null }
      goToPrevPage={previousPageUrl ? goToPreviousPage : null} 
    />
    </>
  );
}

export default App;
 