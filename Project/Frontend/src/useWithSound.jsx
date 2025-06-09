import { useRef, useEffect } from 'react';

export const useWithSound = (audio) => {
  const audioRef = useRef(); // Create a ref to store the audio instance

  useEffect(() => {
    // Initialize the audio element when the component mounts
    if (audio) {
      audioRef.current = new Audio(audio);
    }
  }, [audio]);

  const playSound = () => {
    audioRef.current.play(); // Play the audio when called
    return {};
  }
  return {
    playSound,
  }

}