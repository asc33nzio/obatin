import { createContext } from 'react';
import { EventEmitter } from 'events';

export const obatinEmitter = new EventEmitter();

export const EventEmitterContext = createContext<EventEmitter>(obatinEmitter);
