'use client';

import {
  ModalContainer,
  ModalOverlay,
  ModalHeader,
} from '@/styles/organisms/modal/Modal.styles';

import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { useObatinDispatch } from '@/redux/store/store';
import { resetTxState } from '@/redux/reducers/txSlice';
import ChangePasswordModalContent from './modalContent/ChangePasswordModalContent';
import CloseICO from '@/assets/icons/CloseICO';
import RegisterConfirmPasswordModalContent from './modalContent/RegisterConfirmPasswordModalContent';
import AddAddressModalContent from '@/components/organisms/modal/modalContent/AddAddressModalContent';
import UploadPembayaranModal from '@/components/organisms/modal/modalContent/UploadPembayaranModal';
import SelectAddressModalContent from './modalContent/SelectAddressModalContent';
import SelectDetailPharmacyModalContent from './modalContent/SelectDetailPharmacyModalContent';
import UpdateAddressModalContent from './modalContent/UpdateAddressModalContent';
import AddShippingModalContent from './modalContent/AddShippingModalContent';
import ViewMoreTxModalContent from './modalContent/ViewMoreTxModalContent';

interface DoctorDetailItf {
  name: string;
}

export interface ModalPropsItf {
  $containerWidth: string;
  $containerHeight: string;
  $containerBgColor?: string;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $doctorDetail?: DoctorDetailItf | null;
}

const Modal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  const dispatch = useObatinDispatch();
  const emitter = useEventEmitter();
  const handleModalClose = () => {
    emitter.emit('close-modal-fail');
    dispatch(resetTxState());
    closeModal();
  };

  let modalContent: React.ReactElement | null;
  let title: string | null = null;
  let modalProps: ModalPropsItf = {
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
        $containerWidth: '500px',
        $containerHeight: '325px',
      };
      break;

    case 'confirm-password-doctor':
      modalContent = <ChangePasswordModalContent />;
      title = 'Tolong konfirmasi sandi baru anda';
      modalProps = {
        $containerWidth: '500px',
        $containerHeight: '325px',
      };
      break;
    case 'confirm-password-register':
      modalContent = <RegisterConfirmPasswordModalContent />;
      title = 'Tolong konfirmasi sandi anda';
      modalProps = {
        $containerWidth: '500px',
        $containerHeight: '250px',
      };

      break;

    case 'add-address':
      modalContent = <AddAddressModalContent />;
      title = 'Tambahkan Alamat';
      modalProps = {
        $containerWidth: '650px',
        $containerHeight: '850px',
      };

      break;

    case 'payment-upload':
      modalContent = <UploadPembayaranModal />;
      title = 'Upload Bukti Pembayaran';
      modalProps = {
        $containerWidth: '500px',
        $containerHeight: '500px',
      };

      break;
    case 'select-address':
      modalContent = <SelectAddressModalContent />;
      title = 'Pilih atau tambahkan alamat';
      modalProps = {
        $containerWidth: '500px',
        $containerHeight: '500px',
      };

      break;

    case 'detail-pharmacy':
      modalContent = <SelectDetailPharmacyModalContent />;
      title = 'Detail Pharmacy';
      modalProps = {
        $containerWidth: '650px',
        $containerHeight: '850px',
      };
      break;

    case 'update-address':
      modalContent = <UpdateAddressModalContent />;
      title = 'Ubah Informasi Alamat';
      modalProps = {
        $containerWidth: '650px',
        $containerHeight: '850px',
      };

      break;

    case 'view-more-tx':
      modalContent = <ViewMoreTxModalContent />;
      title = 'Detail Transaksi';
      modalProps = {
        $containerWidth: '1050px',
        $containerHeight: '850px',
      };
      break;

    case 'add-shipping':
      modalContent = <AddShippingModalContent />;
      title = 'Tambahkan Metode Pengiriman';
      modalProps = {
        $containerWidth: '1050px',
        $containerHeight: 'max-content',
      };
      break;

    case 'view-more-tx':
      modalContent = <ViewMoreTxModalContent />;
      title = 'Detail Transaksi';
      modalProps = {
        $containerWidth: '1050px',
        $containerHeight: '850px',
      };
      break;

    case 'view-more-tx':
      modalContent = <ViewMoreTxModalContent />;
      title = 'Detail Transaksi';
      modalProps = {
        $containerWidth: '1050px',
        $containerHeight: '850px',
      };
      break;

    case 'view-more-tx':
      modalContent = <ViewMoreTxModalContent />;
      title = 'Detail Transaksi';
      modalProps = {
        $containerWidth: '1000px',
        $containerHeight: '775px',
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
