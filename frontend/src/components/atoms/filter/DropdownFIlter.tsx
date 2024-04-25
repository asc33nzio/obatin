// import React, { useState } from 'react';
// import { Dropdown } from 'primereact/dropdown';
// import { DropdownButton } from '@/styles/atoms/DropdownFilter.styles';

// export default function DropdownComponent() {
//   const [selectedCity, setSelectedCity] = useState(null);
//   const filter = [
//     { name: 'Nama', code: 'Name' },
//     { name: 'Harga', code: 'Harga' },
//   ];

//   const filter2 = [
//     { name: 'Obat Keras', code: 'OK' },
//     { name: 'Obat Bebas', code: 'OB' },
//     { name: 'Obat Bebas Terbatas', code: 'OBT' },
//     { name: 'Non Obat', code: 'NO' },
//   ];

//   const filter3 = [
//     { name: 'Rendah ke Tinggi', code: 'RT' },
//     { name: 'Tinggi ke Rendah', code: 'TR' },
//   ];

//   return (
//     <>
//       <DropdownButton>
//         <Dropdown
//           value={selectedCity}
//           onChange={(e) => setSelectedCity(e.value)}
//           options={filter}
//           optionLabel='name'
//           placeholder='Urutkan Berdasarkan'
//           checkmark={true}
//           className='DropdownMenu'
//           highlightOnSelect={false}
//         />
//       </DropdownButton>
//       <DropdownButton>
//         <Dropdown
//           value={selectedCity}
//           onChange={(e) => setSelectedCity(e.value)}
//           options={filter2}
//           optionLabel='name'
//           placeholder='Klasifikasi'
//           checkmark={true}
//           className='DropdownMenu'
//           highlightOnSelect={false}
//         />
//       </DropdownButton>
//       <DropdownButton>
//         <Dropdown
//           value={selectedCity}
//           onChange={(e) => setSelectedCity(e.value)}
//           options={filter3}
//           optionLabel='name'
//           placeholder='Ururkan Berdasarkan'
//           checkmark={true}
//           className='DropdownMenu'
//           highlightOnSelect={false}
//         />
//       </DropdownButton>
//     </>
//   );
// }
