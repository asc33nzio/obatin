// import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
// import { useModal } from '@/hooks/useModal';
// import { useToast } from '@/hooks/useToast';
// import CustomButton from '@/components/atoms/button/CustomButton';
// import { AddAddressModalButtonsContainer, AddAddressModalContentContainer } from '@/styles/organisms/modal/modalContent/AddAddressModalContent.styles';

// const AddAddressModalContent = (): React.ReactElement => {
//   const { setToast } = useToast();
//   const { closeModal } = useModal();
//   const { isDesktopDisplay } = useClientDisplayResolution();
// //   const { confirmPasswordValidationError, handleConfirmPasswordInputChange } =
// //     usePasswordValidation();

//   return (
//     <AddAddressModalContentContainer>
//       <PasswordInput
//         validationMessage={confirmPasswordValidationError}
//         onChange={handleConfirmPasswordInputChange}
//         title=''
//         placeholder=''
//         $height={75}
//         $marBot={0}
//       />

//       <AddAddressModalButtonsContainer>
//         <CustomButton
//           content='Batal'
//           $width='150px'
//           $height='50px'
//           $fontSize='22px'
//           $bgColor='#de161c'
//           onClick={() => {
//             closeModal();
//             setToast({
//               showToast: true,
//               toastMessage: 'Tidak ada perubahan',
//               toastType: 'warning',
//               resolution: isDesktopDisplay ? 'desktop' : 'mobile',
//               orientation: 'center',
//             });
//           }}
//         />
//         <CustomButton
//           content='Konfirmasi'
//           $width='150px'
//           $height='50px'
//           $fontSize='22px'
//           onClick={() => {
//             if (addressValidationError) {
//               setToast({
//                 showToast: true,
//                 toastMessage: 'Alamat anda belum sesuai, mohon cek kembali',
//                 toastType: 'error',
//                 resolution: isDesktopDisplay ? 'desktop' : 'mobile',
//                 orientation: 'center',
//               });
//               return;
//             }

//             closeModal();
//             setToast({
//               showToast: true,
//               toastMessage:
//                 'Kata sandi tersimpan. Klik simpan profil untuk menyelesaikan pengubahan',
//               toastType: 'ok',
//               resolution: isDesktopDisplay ? 'desktop' : 'mobile',
//               orientation: 'center',
//             });
//           }}
//         />
//       </AddAddressModalButtonsContainer>
//     </AddAddressModalContentContainer>
//   );
// };

// export default AddAddressModalContent;
