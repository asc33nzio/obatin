import { useContext } from 'react';
import { EventEmitterContext } from '@/contexts/eventEmitterContext';

export const useEventEmitter = () => useContext(EventEmitterContext);
