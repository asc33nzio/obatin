'use client';
import { PropagateLoader } from 'react-spinners';

const PropagateLoad = (): React.ReactElement => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: '#ffffff',
        backdropFilter: 'blur(4px)',
        zIndex: '30',
      }}
    >
      <PropagateLoader
        color='#36d7b7'
        loading={true}
        size={25}
        cssOverride={{ display: 'flex' }}
      />
    </div>
  );
};

export default PropagateLoad;
