'use client';
import { PropagateLoader } from 'react-spinners';

const PropagateLoad = (): React.ReactElement => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#ffffff',
      }}
    >
      <PropagateLoader
        color='#36d7b7'
        loading={true}
        size={25}
        cssOverride={{ display: 'block', margin: '0 auto' }}
      />
      ;
    </div>
  );
};

export default PropagateLoad;
