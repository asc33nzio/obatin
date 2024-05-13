import { IPendingDoctorResponseData } from '@/app/admin/doctor-approval/page';
import SeeDetail from '@/assets/admin/SeeDetail';
import React, { useState } from 'react';

interface IPropsRowTable {
  item: IPendingDoctorResponseData;
}

const TableRow = (props: IPropsRowTable) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <>
      {props.item.specialization_name}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
      >
        <SeeDetail onHover={showDescription} />
        {showDescription && (
          <div
            style={{
              position: 'absolute',
              right: '-30vw',
              top: '-8vh',
              width: '30vw',
              backgroundColor: 'white',
              boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
              padding: '10px',
            }}
          >
            {props.item.specialization_description}
          </div>
        )}
      </div>
    </>
    //   </td>
  );
};

export default TableRow;
