import { ClientDisplayResolutionItf } from '@/types/clientDisplayResolutionTypes';
import { createContext } from 'react';

const ClientDisplayResolutionContext = createContext<
  ClientDisplayResolutionItf | undefined
>(undefined);

export default ClientDisplayResolutionContext;
