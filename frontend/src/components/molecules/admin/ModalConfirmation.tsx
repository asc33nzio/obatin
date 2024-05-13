import React from 'react';

interface IModalConfirmation {
  content?: string;
  confirmContent?: string;
  cancelContent?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ModalConfirmation(props: IModalConfirmation) {
  const onCancelClick = () => {
    props.onCancel();
  };
  const onConfirmClick = () => {
    props.onConfirm();
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: '20vh',
          width: '20vw',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
          zIndex: '15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '5%',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {props.content || 'Apakah anda yakin '}
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignSelf: 'center',
            gap: '25px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px 20px',
              backgroundColor: 'white',
              color: 'red',
              borderRadius: '6px',
              boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              width: '50%',
            }}
            onClick={() => onCancelClick()}
          >
            {props.confirmContent || 'cek lagi'}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px 20px',
              backgroundColor: '#00B5C0',
              color: 'white',
              borderRadius: '6px',
              boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              width: '50%',
              textAlign: 'center',
            }}
            onMouseDown={(e) => {
              onConfirmClick();
              e.preventDefault();
            }}
          >
            {props.cancelContent || 'ya'}
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalConfirmation;
