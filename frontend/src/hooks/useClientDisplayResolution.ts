import { useContext } from 'react';
import { ClientDisplayResolutionItf } from '@/types/clientDisplayResolutionTypes';
import ClientDisplayResolutionContext from '@/contexts/clientDisplayResolutionContext';

export const useClientDisplayResolution = (): ClientDisplayResolutionItf => {
  const context = useContext(ClientDisplayResolutionContext);
  if (!context) {
    throw new Error('ClientDisplayResolution context missing!');
  }

  return context;
};
