import { ModalContextItf } from '@/types/modalTypes';
import { createContext } from 'react';

const ModalContext = createContext<ModalContextItf | undefined>(undefined);

export default ModalContext;
