/* eslint-disable */
import { useRef, useEffect } from 'react';

export const useWithSound = (audio) => {
  const audioRef = useRef();

  useEffect(() => {
    audioRef.current = new Audio(audio);
  }, []);

  const playSound = () => {
    audioRef.current.play();
    return {};
  }
  return {
    playSound,
  }

}