'use client';
import {
  ModalContainer,
  ModalOverlay,
  ModalHeader,
} from '@/styles/organisms/modal/Modal.styles';
import { InvokableModalType } from '@/types/modalTypes';
import DoctorDetailModalContent from './modalContent/DoctorDetailModalContent';
import CloseICO from '@/assets/icons/CloseICO';
import SelectDetailPharmacyModalContent from './modalContent/SelectDetailPharmacyModalContent';
import { PharmacyItf } from '@/types/pharmacyTypes';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';

export interface DoctorDetailItf {
  id?: number | undefined;
  name: string | undefined;
  specialization: string | undefined;
  experiences: number | undefined;
  fee: number | undefined;
  openingTime: string | undefined;
  operationalHours: string | undefined;
  operationalDays: [] | undefined;
}

export interface ModalPropsItf {
  $overlayHeight?: string;
  $containerWidth: string;
  $containerHeight: string;
  $containerBgColor?: string;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $onOpen: () => void;
  $isOpen: boolean;
  $onClose: () => void;
}

const InvokableModal = (props: {
  $doctorDetail?: DoctorDetailItf;
  $pharmacyDetail?: PharmacyItf;
  $productId?: PharmacyItf;
  modalType: InvokableModalType;
  $onOpen: Function;
  $isOpen: boolean;
  $onClose: () => void;
}) => {
  let modalContent: React.ReactElement | null;
  let title: string | null = null;
  let modalProps: ModalPropsItf = {
    $overlayHeight: '100vh',
    $containerWidth: '500px',
    $containerHeight: '500px',
    $containerBgColor: '#ffffff',
    $fontSize: '18px',
    $color: '#4a5568',
    $onOpen: () => {},
    $isOpen: false,
    $onClose: () => {},
  };
  const { isDesktopDisplay } = useClientDisplayResolution();

  switch (props.modalType) {
    case 'doctor-detail':
      modalContent = (
        <DoctorDetailModalContent $doctorDetail={props.$doctorDetail} />
      );
      title = 'Detail Dokter';
      modalProps = {
        $overlayHeight: '200vh',
        $containerWidth: !isDesktopDisplay ? '350px' : '450px',
        $containerHeight: '500px',
        $onOpen: () => {},
        $isOpen: false,
        $onClose: () => {},
      };
      break;

    case 'pharmacy-detail':
      modalContent = (
        <SelectDetailPharmacyModalContent
          $pharmacyDetail={props.$pharmacyDetail}
        />
      );
      title = '';
      modalProps = {
        $overlayHeight: '200vh',
        $containerWidth: !isDesktopDisplay ? '350px' : '450px',
        $containerHeight: 'max-content',
        $onOpen: () => {},
        $isOpen: false,
        $onClose: () => {},
      };
      break;

    default:
      modalContent = null;
      title = null;
      break;
  }

  return (
    props.$isOpen && (
      <ModalOverlay {...modalProps}>
        <ModalContainer {...modalProps}>
          <ModalHeader>
            <h1>{title}</h1>
            <CloseICO onClick={props.$onClose} />
          </ModalHeader>
          {modalContent}
        </ModalContainer>
      </ModalOverlay>
    )
  );
};

export default InvokableModal;
