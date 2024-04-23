import { ToastContextItf } from '@/types/toastTypes';
import { createContext } from 'react';

const ToastContext = createContext<ToastContextItf | undefined>(undefined);

export default ToastContext;
