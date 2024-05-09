'use client';
import {
  ModalContainer,
  ModalOverlay,
  ModalHeader,
} from '@/styles/organisms/modal/Modal.styles';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import ChangePasswordModalContent from './modalContent/ChangePasswordModalContent';
import CloseICO from '@/assets/icons/CloseICO';
import RegisterConfirmPasswordModalContent from './modalContent/RegisterConfirmPasswordModalContent';
import AddAddressModalContent from '@/components/organisms/modal/modalContent/AddAddressModalContent';
import UploadPembayaranModal from '@/components/organisms/modal/modalContent/UploadPembayaranModal';
import SelectAddressModalContent from './modalContent/SelectAddressModalContent';
import SelectDetailPharmacyModalContent from './modalContent/SelectDetailPharmacyModalContent';
import UpdateAddressModalContent from './modalContent/UpdateAddressModalContent';
import ViewMoreTxModalContent from './modalContent/ViewMoreTxModalContent';

interface DoctorDetailItf {
  name: string;
}

export interface ModalPropsItf {
  $overlayHeight?: string;
  $containerWidth: string;
  $containerHeight: string;
  $containerBgColor?: string;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $doctorDetail?: DoctorDetailItf | null;
}

const Modal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  const emitter = useEventEmitter();

  const handleModalClose = () => {
    emitter.emit('close-modal-fail');
    closeModal();
  };

  let modalContent: React.ReactElement | null;
  let title: string | null = null;
  let modalProps: ModalPropsItf = {
    $overlayHeight: '100vh',
    $containerWidth: '500px',
    $containerHeight: '500px',
    $containerBgColor: '#ffffff',
    $fontSize: '18px',
    $color: '#4a5568',
    $doctorDetail: null,
  };

  switch (modalType) {
    case 'confirm-password':
      modalContent = <ChangePasswordModalContent />;
      title = 'Tolong konfirmasi sandi baru anda';
      modalProps = {
        $overlayHeight: '135vh',
        $containerWidth: '500px',
        $containerHeight: '325px',
      };
      break;

    case 'confirm-password-doctor':
      modalContent = <ChangePasswordModalContent />;
      title = 'Tolong konfirmasi sandi baru anda';
      modalProps = {
        $overlayHeight: '135vh',
        $containerWidth: '500px',
        $containerHeight: '325px',
      };
      break;

    case 'confirm-password-register':
      modalContent = <RegisterConfirmPasswordModalContent />;
      title = 'Tolong konfirmasi sandi anda';
      modalProps = {
        $overlayHeight: '100vh',
        $containerWidth: '500px',
        $containerHeight: '250px',
      };
      break;

    case 'add-address':
      modalContent = <AddAddressModalContent />;
      title = 'Tambahkan Alamat';
      modalProps = {
        $overlayHeight: '170vh',
        $containerWidth: '650px',
        $containerHeight: '850px',
      };
      break;

    case 'payment-upload':
      modalContent = <UploadPembayaranModal />;
      title = 'Upload Bukti Pembayaran';
      modalProps = {
        $overlayHeight: '100vh',
        $containerWidth: '500px',
        $containerHeight: '500px',
        // $bgColor: 'white',
      };
      break;

    case 'select-address':
      modalContent = <SelectAddressModalContent />;
      title = 'Pilih atau tambahkan alamat';
      modalProps = {
        $overlayHeight: '100vh',
        $containerWidth: '500px',
        $containerHeight: '500px',
      };
      break;

    case 'detail-pharmacy':
      modalContent = <SelectDetailPharmacyModalContent />;
      title = 'Detail Pharmacy';
      modalProps = {
        $overlayHeight: '170vh',
        $containerWidth: '650px',
        $containerHeight: '850px',
      };
      break;

    case 'update-address':
      modalContent = <UpdateAddressModalContent />;
      title = 'Ubah Informasi Alamat';
      modalProps = {
        $overlayHeight: '170vh',
        $containerWidth: '650px',
        $containerHeight: '850px',
      };
      break;

    case 'view-more-tx':
      modalContent = <ViewMoreTxModalContent />;
      title = 'Detail Transaksi';
      modalProps = {
        $overlayHeight: '170vh',
        $containerWidth: '1050px',
        $containerHeight: '850px',
      };
      break;

    default:
      modalContent = null;
      title = null;
      break;
  }

  return (
    isOpen && (
      <ModalOverlay {...modalProps}>
        <ModalContainer {...modalProps}>
          <ModalHeader>
            <h1>{title}</h1>
            <CloseICO onClick={handleModalClose} />
          </ModalHeader>
          {modalContent}
        </ModalContainer>
      </ModalOverlay>
    )
  );
};

export default Modal;
