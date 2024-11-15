import { useContext } from 'react';
import { createContext } from 'react';

export const AppContext = createContext();

const useAppContext = () => {
  return useContext(AppContext);
};

export default useAppContext;
