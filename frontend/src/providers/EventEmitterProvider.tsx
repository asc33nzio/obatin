import {
  EventEmitterContext,
  obatinEmitter,
} from '@/contexts/eventEmitterContext';

export const EventEmitterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <EventEmitterContext.Provider value={obatinEmitter}>
      {children}
    </EventEmitterContext.Provider>
  );
};
