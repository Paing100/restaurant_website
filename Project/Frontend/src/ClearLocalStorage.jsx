import { useEffect } from 'react';    

function ClearLocalStorage(){
  useEffect(() => {
    localStorage.clear();
    console.log('Local storage cleared');
  }, [])
}

export default ClearLocalStorage;