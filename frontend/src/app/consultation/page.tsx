'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MagnifyBlueICO from '@/assets/icons/MagnifyBlueICO';
import AttachFileICO from '@/assets/icons/AttachFileICO';
import SendChatICO from '@/assets/icons/SendChatICO';
import { ChatRoomContainer } from '@/styles/molecules/ChatRoom.styles';
import { AvatarImage } from '@/styles/atoms/AvatarImage.styles';
import {
  ArrowButtonMobileOnly,
  ChatRoomSection,
  MessageRoomSection,
} from '@/styles/organisms/ChatRoomListContainer.styles';
import { ChatRoomPage } from '@/styles/pages/ChatRoomListContainer.styles';
import { IChatRoom } from '@/types/chatRoomItf';
import axios from 'axios';
import useSWR from 'swr';
import { getCookie } from 'cookies-next';
import MessageSection from '@/components/organisms/chat/MessageSection';
import { jwtDecode } from 'jwt-decode';
import { DecodedJwtItf } from '@/types/jwtTypes';
import SearchDrugPres, {
  CompactProductItf,
} from '@/components/molecules/chat/searchDrugPrescription';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import {
  IAxiosResponseCreatePrescription,
  ICartPayloadBulkAddCartFromPrescription,
  IDetailPrescriptionData,
  IGetAllChatRoom,
  IOneDrugDetailPrescription,
  IPayloadCreatePrescription,
  IResponseOneDetailPrescription,
  OneItemPrescriptionItf,
} from '@/types/chat';
import { NoRoomSelectedImage } from '@/assets/chat/NoRoomSelectedImage';
import UploadFile from '@/assets/chat/UploadFile';
import { Document, Page, pdfjs } from 'react-pdf';
import LeftArrowICO from '@/assets/arrows/LeftArrowICO';
import RightArrowICO from '@/assets/arrows/RightArrowICO ';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function ChatPage(): React.ReactElement {
  const accessToken = getCookie('access_token');
  const decoded: DecodedJwtItf | null = accessToken
    ? jwtDecode(accessToken)
    : null;
  const role = decoded?.Payload?.role;
  const [inputValues, setInputValues] = useState<{
    [key: string]: string | number;
  }>({});
  const [inputFile, setInputFile] = useState<{
    [key: string]: Blob;
  }>({});
  const [selectedIdChatRoom, setSelectedIdChatRoom] = useState<number>();
  const [isChatRoomActive, setIsChatRoomActive] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingText, setTypingText] = useState('');
  const [isModalPrescriptionOpen, setIsModalPrescriptionOpen] =
    useState<boolean>(false);
  const [quantity, setQuantity] = useState('');
  const [errorMessageQty, setErrorMessageQty] = useState<string | null>();
  const [errorMessageDrug, setErrorMessageDrug] = useState<string | null>();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [prescription, setPrescription] = useState<CompactProductItf[]>([]);
  const [deleteFunction, setDeleteFunction] = useState<() => void>(() => {});
  const [payloadCreatePrescription, setPayloadCreatePrescription] =
    useState<IPayloadCreatePrescription | null>();
  const [selectedDrugParent, setSelectedDrugParent] =
    useState<CompactProductItf | null>();
  const [isDropdownAttachFileOpen, setIsDropdownAttachFileOpen] =
    useState<boolean>(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState<boolean>(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    number | null
  >(null);
  const [
    isModalConfirmAddPrescriptionToCartOpen,
    setIsModalConfirmAddPrescriptionToCartOpen,
  ] = useState<boolean>(false);
  const handleSelectedDrugChange = (
    newSelectedDrug: CompactProductItf | null,
  ) => {
    if (newSelectedDrug) {
      setSelectedDrugParent(newSelectedDrug);
    } else {
      setSelectedDrugParent(null);
    }
  };

  const [isChatRoomShowOnMobile, setIsChatRoomShowOnMobile] =
    useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = event.target.value;
    setQuantity(newQuantity);
  };

  const handleClickAddPrescription = () => {
    if (!selectedDrugParent) {
      setErrorMessageDrug('Tolong pilih obat');
      return;
    }

    if (isNaN(Number(quantity)) || quantity == '' || Number(quantity) <= 0) {
      setErrorMessageQty('Masukkan nilai jumlah dan positif');
      return;
    }

    const updatedPrescription = [...prescription];

    if (selectedDrugParent && quantity !== '') {
      const newPrescriptionItem = {
        ...selectedDrugParent,
        quantity: Number(quantity),
      };
      updatedPrescription.push(newPrescriptionItem);
      setPrescription(updatedPrescription);
      setQuantity('');
      handleClearSelectedDrug();
      setErrorMessageDrug(null);
      setErrorMessageQty(null);
      deleteFunction();
    } else {
      setToast({
        showToast: true,
        toastMessage: `Tolong pilih produk dan masukkan jumlah`,
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const handleClickDropdownAddPrescription = () => {
    setIsModalPrescriptionOpen(true);
    setIsDropdownAttachFileOpen(!isDropdownAttachFileOpen);
  };

  const handleClickClose = () => {
    setIsModalOpen(false);
    setFileCoba(null);
    setPreviewUrl(null);
  };

  const convertAddPrescriptionToPayload = (
    prescriptionData: CompactProductItf[],
  ) => {
    const temp: OneItemPrescriptionItf[] = [];
    prescriptionData.forEach((item: CompactProductItf) => {
      temp.push({
        product_id: item.id,
        amount: item.quantity,
      });
    });
    return temp;
  };

  const convertAddCartFromPrescriptionToPayload = (
    drugData: IDetailPrescriptionData,
  ) => {
    const temp: ICartPayloadBulkAddCartFromPrescription[] = [];
    drugData?.items.forEach((item: IOneDrugDetailPrescription) => {
      temp.push({
        product_id: item.product_id,
        prescription_id: drugData.PrescriptionId,
        quantity: item.quantity,
      });
    });
    return temp;
  };

  const handlePostPrescription = async () => {
    const payload: OneItemPrescriptionItf[] =
      convertAddPrescriptionToPayload(prescription);
    const updatedPayload = {
      user_id: payloadCreatePrescription?.user_id ?? 0,
      items: payload,
    };

    try {
      const response: IAxiosResponseCreatePrescription = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions`,
        JSON.stringify(updatedPayload),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const timeNow = Date.now();
      selectedIdChatRoom &&
        postMessage(
          selectedIdChatRoom,
          `%prescription-doctor-obatin-${timeNow}-${response.data.data.id}`,
        );
      setToast({
        showToast: true,
        toastMessage: 'Berhasil membuat resep',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      setTimeout(() => {
        setIsModalPrescriptionOpen(false);
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setToast({
        showToast: true,
        toastMessage: `Gagal tambah resep: ${errorMessage}`,
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const handlePostCartFromPrescription = async () => {
    if (!dataPrescriptionById) {
      return;
    }
    const payload: ICartPayloadBulkAddCartFromPrescription[] =
      convertAddCartFromPrescriptionToPayload(dataPrescriptionById?.data);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart`,
        JSON.stringify({ cart: payload }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setToast({
        showToast: true,
        toastMessage: 'Berhasil menambahkan obat ke keranjang',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      setTimeout(() => {
        setIsModalConfirmAddPrescriptionToCartOpen(false);
        setIsModalConfirmAddPrescriptionToCartOpen(false);
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setToast({
        showToast: true,
        toastMessage: `Gagal menambahkan obat ke keranjang : ${errorMessage}`,
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const handleClearSelectedDrug = () => {
    setSelectedDrugParent(null);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setPrescription((prevPrescription) => {
      const updatedPrescription = [...prevPrescription];
      updatedPrescription.splice(indexToRemove, 1);
      return updatedPrescription;
    });
  };

  const handleClickPrescription = (id: number) => {
    setIsPrescriptionOpen(true);
    setSelectedPrescriptionId(id);
  };

  const fetcherChatRoom = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const { data: dataChatRoom } = useSWR<IGetAllChatRoom>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room`,
    fetcherChatRoom,
    { refreshInterval: 4000 },
  );

  const fetcherPrescriptionById = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const { data: dataPrescriptionById } = useSWR<IResponseOneDetailPrescription>(
    selectedPrescriptionId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/${selectedPrescriptionId}`
      : null,
    fetcherPrescriptionById,
  );

  const fetcherMessage = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data.data);

  const { data: dataMessage } = useSWR(
    selectedIdChatRoom
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room/${selectedIdChatRoom}`
      : null,
    fetcherMessage,
    { refreshInterval: 1000 },
  );

  const observerRef = useRef(null);

  let avatarSrc = '';

  if (role === 'user') {
    avatarSrc =
      dataMessage?.doctor?.avatar_url ||
      'https://res.cloudinary.com/dzoleanvi/image/upload/v1714800537/go-cloudinary/user_ch6wxc.png';
  } else if (role === 'doctor') {
    avatarSrc =
      dataMessage?.user?.avatar_url ||
      'https://res.cloudinary.com/dzoleanvi/image/upload/v1714800537/go-cloudinary/user_ch6wxc.png';
  }

  const updateIsTyping = useCallback(async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room/${selectedIdChatRoom}`,
        { is_typing: isTyping },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error: any) {
      console.log(error);
    }
  }, [isTyping, selectedIdChatRoom, accessToken]);

  const postMessage = async (id: number, message: string | number) => {
    try {
      if (typeof message === 'string') {
        if (!message.trim()) {
          setTimeout(() => {
            setToast({
              showToast: true,
              toastMessage: 'can not send empty message',
              toastType: 'error',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }, 2000);
          return;
        }

        if (message.length >= 255) {
          setTimeout(() => {
            setToast({
              showToast: true,
              toastMessage: 'can not send message greater than 255 character',
              toastType: 'error',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }, 2000);
          return;
        }
      } else {
        setTimeout(() => {
          setToast({
            showToast: true,
            toastMessage: 'can not send empty message',
            toastType: 'error',
            resolution: isDesktopDisplay ? 'desktop' : 'mobile',
            orientation: 'center',
          });
        }, 2000);
        return;
      }
      inputValues['chat_room_id'] = id;
      inputValues['message'] = message;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/message`,
        JSON.stringify(inputValues),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setInputValues({ ...inputValues, ['message']: '' });
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setToast({
        showToast: true,
        toastMessage: `Gagal kirim pesan: ${errorMessage}`,
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'instant',
    });
  }, []);

  useEffect(() => {
    const handleIsTypingChange = () => {
      const message = inputValues['message'];
      setIsTyping(message !== '');
    };

    handleIsTypingChange();

    return () => {};
  }, [inputValues]);

  useEffect(() => {
    setIsTyping(false);
  }, []);

  useEffect(() => {
    updateIsTyping();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  useEffect(() => {
    if (role === 'doctor') {
      setTypingText(dataMessage?.is_user_typing ? 'user is typing...' : '');
    } else if (role === 'user') {
      setTypingText(dataMessage?.is_doctor_typing ? 'doctor is typing...' : '');
    }
  }, [role, dataMessage]);

  const handleInputValueChange = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(name, event.target.value);
  };

  const handleClickChatRoom = (
    chatRoomId: number,
    isActive: boolean,
    userId: number,
  ) => {
    setSelectedIdChatRoom(chatRoomId);
    setIsChatRoomActive(isActive);
    setPayloadCreatePrescription({
      user_id: userId,
      items: [],
    });
    setIsChatRoomShowOnMobile(false);
  };

  const handleInputChange = (name: string, value: string) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleInputFileChange = (name: string, value: File) => {
    setInputFile({ ...inputFile, [name]: value });
  };

  const [fileCoba, setFileCoba] = useState<File | null>(null);

  const handleInputValueFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const type = file.type;

      if (type.startsWith('image/')) {
        setFileCoba(null);
        handleInputFileChange('image', file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else if (type.startsWith('application/pdf')) {
        setPreviewUrl(null);
        setFileCoba(file);
        handleInputFileChange('file', file);
      } else {
        setToast({
          showToast: true,
          toastMessage: 'file tidak didukung',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
    }
  };

  const postCloudinary = async () => {
    try {
      const formData = new FormData();
      for (const key in inputFile) {
        formData.append(key, inputFile[key]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cloudinary/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      selectedIdChatRoom &&
        postMessage(
          selectedIdChatRoom,
          response.data.data.image_url || response?.data?.data?.file_url,
        );
      setToast({
        showToast: true,
        toastMessage: fileCoba
          ? 'berhasil upload file'
          : 'berhasil upload gambar',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      setIsModalOpen(false);
      setInputFile({});
      setPreviewUrl(null);
      setFileCoba(null);
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setToast({
        showToast: true,
        toastMessage: `Gagal upload: ${errorMessage}`,
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  return (
    <>
      <ChatRoomPage height='100vh' width='100vw'>
        <Navbar />
        <div style={{ display: 'flex', flexGrow: '1', marginTop: '-25px' }}>
          <ChatRoomSection
            width='30%'
            height='100%'
            isDisplay={isChatRoomShowOnMobile}
          >
            <div
              style={{
                width: '100%',
                height: '12%',
                backgroundColor: '#00B5C0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <div
                style={{
                  width: '70%',
                  height: '50px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '0 10px',
                }}
              >
                <MagnifyBlueICO />
                <input style={{ padding: '10px', flexGrow: '1' }}></input>
              </div>

              <ArrowButtonMobileOnly
                onClick={() => setIsChatRoomShowOnMobile(false)}
              >
                <RightArrowICO />
              </ArrowButtonMobileOnly>
            </div>

            <ChatRoomSection
              height='75vh'
              overFlowY='auto'
              isDisplay={isChatRoomShowOnMobile}
            >
              {dataChatRoom?.data?.length !== 0 ? (
                dataChatRoom?.data?.map((el: IChatRoom, index: number) => (
                  <ChatRoomContainer
                    key={index}
                    width='100%'
                    gap='10px'
                    padding='10px 20px'
                    align_items='center'
                    border_bottom='1px solid grey'
                    background_color={
                      el.chat_room_id == selectedIdChatRoom
                        ? '#d7d7d7'
                        : 'inherit'
                    }
                    onClick={() =>
                      handleClickChatRoom(
                        el?.chat_room_id,
                        el?.is_active,
                        el?.user_id,
                      )
                    }
                    hoverEffect
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <AvatarImage height='60px' width='60px'>
                          <Image
                            src={
                              el?.avatar_url_doctor ||
                              el?.avatar_url_user ||
                              'https://res.cloudinary.com/dzoleanvi/image/upload/v1714800537/go-cloudinary/user_ch6wxc.png'
                            }
                            alt=''
                            layout='fill'
                            objectFit='contain'
                          />
                        </AvatarImage>
                        <ChatRoomContainer
                          width='100%'
                          flex_direction='column'
                          gap='5px'
                          background_color='inherit'
                        >
                          <div style={{ fontSize: '20px', fontWeight: '600' }}>
                            {el?.doctor_name || el?.user_name}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '400' }}>
                            {el?.last_message?.includes(
                              '%prescription-doctor-obatin',
                            )
                              ? 'resep.pdf'
                              : el?.last_message}
                          </div>
                        </ChatRoomContainer>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div
                          style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: el?.is_active
                              ? '#90D26D'
                              : '#C7C8CC',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <div>{el?.is_active ? 'Aktif' : 'Non-aktif'}</div>
                      </div>
                    </div>
                  </ChatRoomContainer>
                ))
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: '600',
                  }}
                >
                  Tidak ada ruang percakapan
                </div>
              )}

              <div ref={observerRef}></div>
            </ChatRoomSection>
          </ChatRoomSection>
          <MessageRoomSection
            width='70%'
            height='100%'
            isDisplay={!isChatRoomShowOnMobile}
          >
            {dataMessage?.message ? (
              <>
                <ChatRoomContainer
                  width='100%'
                  padding='20px'
                  is_shadow_active={true}
                  height='12%'
                  justify_content='space-between'
                  align_items='center'
                >
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <AvatarImage height='60px' width='60px'>
                      <Image
                        src={avatarSrc}
                        alt=''
                        layout='fill'
                        objectFit='contain'
                      />
                    </AvatarImage>
                    <ChatRoomContainer
                      width='100%'
                      flex_direction='column'
                      gap='5px'
                      background_color='inherit'
                      justify_content='center'
                    >
                      <div>
                        {role === 'user' && (
                          <div style={{ fontSize: '20px', fontWeight: '600' }}>
                            {dataMessage?.doctor?.name}
                          </div>
                        )}
                        {role === 'doctor' && (
                          <>
                            <div>
                              <div
                                style={{ fontSize: '20px', fontWeight: '600' }}
                              >
                                {dataMessage?.user?.name || 'User'}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {role === 'user' && (
                        <div style={{ fontSize: '14px', fontWeight: '400' }}>
                          {dataMessage?.doctor?.specialization}
                        </div>
                      )}
                      {role === 'user' && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              backgroundColor: dataMessage?.doctor?.is_online
                                ? '#90D26D'
                                : '#C7C8CC',
                              borderRadius: '50%',
                            }}
                          ></div>
                          <div>
                            {dataMessage?.doctor?.is_online
                              ? 'Online'
                              : 'Offline'}
                          </div>
                        </div>
                      )}
                    </ChatRoomContainer>
                  </div>
                  <ArrowButtonMobileOnly
                    onClick={() => setIsChatRoomShowOnMobile(true)}
                    background='#00B5C0'
                  >
                    <LeftArrowICO />
                  </ArrowButtonMobileOnly>
                </ChatRoomContainer>
                <div style={{ backgroundColor: '#e3e3e3', flexGrow: '1' }}>
                  <div
                    style={{
                      height: '80%',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <MessageSection
                      message={dataMessage?.message}
                      role={role}
                      onClickChildPrescription={handleClickPrescription}
                    />
                  </div>
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '5%',
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: '90%',
                        display: 'flex',
                        alignItems: 'center',
                        fontStyle: 'italic',
                      }}
                    >
                      {typingText && <div>{typingText}</div>}
                    </div>
                  </div>
                  <div
                    style={{
                      height: '15%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        height: '90%',
                        width: '90%',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isChatRoomActive ? (
                        <div
                          style={{
                            display: 'flex',
                            width: '100%',
                            height: '65%',
                            backgroundColor: '#00B5C0',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px',
                          }}
                        >
                          <div
                            style={{
                              position: 'relative',
                            }}
                          >
                            <AttachFileICO
                              onClick={() =>
                                setIsDropdownAttachFileOpen(
                                  !isDropdownAttachFileOpen,
                                )
                              }
                            />
                            {isDropdownAttachFileOpen && (
                              <div
                                style={{
                                  width: '200px',
                                  height: role === 'user' ? '50px' : '100px',
                                  position: 'absolute',
                                  top: role === 'user' ? '-50px' : '-105px',
                                  zIndex: '10',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  color: '#00B5C0',
                                  backgroundColor: 'white',
                                  borderRadius: '18px',
                                  overflow: 'hidden',
                                  boxShadow:
                                    '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
                                }}
                                onFocus={() =>
                                  setIsDropdownAttachFileOpen(true)
                                }
                                onBlur={() =>
                                  setIsDropdownAttachFileOpen(false)
                                }
                              >
                                <div
                                  style={{
                                    height: role === 'user' ? '100%' : '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() =>
                                    setIsDropdownAttachFileOpen(
                                      !isDropdownAttachFileOpen,
                                    )
                                  }
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                      '#ededed';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                  }}
                                >
                                  <div onClick={() => setIsModalOpen(true)}>
                                    lampirkan file
                                  </div>
                                </div>
                                {role === 'doctor' && (
                                  <div
                                    style={{
                                      height: '50%',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        '#ededed';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        'white';
                                    }}
                                    onClick={handleClickDropdownAddPrescription}
                                  >
                                    buat resep
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <input
                            style={{
                              flexGrow: '1',
                              height: '80%',
                              padding: '20px',
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (selectedIdChatRoom !== undefined) {
                                  postMessage(
                                    selectedIdChatRoom,
                                    inputValues['message'],
                                  );
                                }
                                // else {
                                //   console.error(
                                //     'selectedIdChatRoom is undefined',
                                //   );
                                // }
                              }
                            }}
                            name='message'
                            value={inputValues['message'] || ''}
                            onChange={(e) =>
                              handleInputValueChange('message', e)
                            }
                          />
                          <SendChatICO
                            onClick={() => {
                              if (selectedIdChatRoom !== undefined) {
                                postMessage(
                                  selectedIdChatRoom,
                                  inputValues['message'],
                                );
                              }
                              // else {
                              //   console.error(
                              //     'selectedIdChatRoom is undefined',
                              //   );
                              // }
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '24px',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <ArrowButtonMobileOnly
                    onClick={() => setIsChatRoomShowOnMobile(true)}
                    background='#00B5C0'
                  >
                    <LeftArrowICO />
                  </ArrowButtonMobileOnly>
                </div>
                <NoRoomSelectedImage />
                Pilih ruang percakapan
              </div>
            )}
          </MessageRoomSection>
        </div>
        {isModalPrescriptionOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '70vh',
              width: '70vw',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
              zIndex: '10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '5%',
            }}
          >
            <h2>Tambah obat ke resep</h2>
            <div
              style={{
                display: 'flex',
                gap: '5%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
              >
                {errorMessageDrug && (
                  <div style={{ color: 'red', fontSize: '12px' }}>
                    {errorMessageDrug}
                  </div>
                )}
                <SearchDrugPres
                  setSelectedDrugParent={handleSelectedDrugChange}
                  setDeleteFunction={(func) => setDeleteFunction(func)}
                />
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
              >
                {errorMessageQty && (
                  <div style={{ color: 'red', fontSize: '12px' }}>
                    {errorMessageQty}
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.2)',
                    padding: '12px',
                    alignItems: 'center',
                    borderRadius: '6px',
                  }}
                >
                  Jumlah :
                  <input
                    style={{
                      padding: '5px',
                      border: 'none',
                    }}
                    placeholder='masukkan jumlah'
                    name='quantity'
                    onChange={handleQuantityChange}
                    value={quantity}
                  ></input>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '15px 10px',
                  backgroundColor: '#00B5C0',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={handleClickAddPrescription}
              >
                Tambah ke resep
              </div>
            </div>

            <div
              style={{
                width: '80%',
                height: '60%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '80%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  padding: '0 10px',
                }}
              >
                <div
                  style={{ fontSize: '24px', fontWeight: '500', width: '60%' }}
                >
                  Name obat
                </div>
                <div
                  style={{ fontSize: '24px', fontWeight: '500', width: '20%' }}
                >
                  Jumlah
                </div>
                <div
                  style={{ fontSize: '24px', fontWeight: '500', width: '20%' }}
                >
                  Aksi
                </div>
              </div>
              <hr style={{ width: '80%' }}></hr>
              <div
                style={{
                  width: '80%',
                  height: '30vh',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {prescription.map((el, index) => (
                  <div
                    key={index + 1}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      margin: '10px 0',
                      padding: '0 10px',
                    }}
                  >
                    <Image width={70} height={40} alt='' src={el.image_url} />
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        width: '60%',
                      }}
                    >
                      {el.name}
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '500',
                        width: '20%',
                        display: 'flex',
                      }}
                    >
                      {el.quantity}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '5px',
                        backgroundColor: '#00B5C0',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        width: '10%',
                      }}
                      onClick={() => handleRemoveItem(index)}
                    >
                      hapus
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignSelf: 'end',
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
                }}
                onClick={() => setIsModalPrescriptionOpen(false)}
              >
                batal
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
                }}
                onMouseDown={(e) => {
                  handlePostPrescription();
                  e.preventDefault();
                }}
              >
                konfirmasi
              </div>
            </div>
          </div>
        )}
        {isPrescriptionOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '70vh',
              width: '70vw',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
              zIndex: '10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '5%',
            }}
          >
            <h2>Resep</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                width: '80%',
              }}
            >
              <div>Nama Dokter : {dataPrescriptionById?.data?.doctor_name}</div>
              <div>
                Spesialisasi :{' '}
                {dataPrescriptionById?.data?.doctor_specialization}
              </div>
              <div>Nama Pasien : {dataPrescriptionById?.data?.user_name}</div>
            </div>

            <div
              style={{
                width: '80%',
                height: '60%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <hr style={{ width: '100%' }}></hr>
              <div
                style={{
                  width: '100%',
                  height: '35vh',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0 5px',
                }}
              >
                {dataPrescriptionById?.data?.items?.map((el, index: number) => (
                  <div
                    key={index + 1}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      margin: '10px 0',
                      padding: '0 10px',
                      height: '20vh',
                      backgroundColor: '#ebebeb',
                      boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Image
                      width={230}
                      height={160}
                      alt=''
                      src={el?.product_image_url}
                    />
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        width: '60%',
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      {el?.product_name}
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '500',
                        width: '40%',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      x {el?.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignSelf: 'end',
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
                }}
                onClick={() => setIsPrescriptionOpen(false)}
              >
                batal
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
                }}
                onMouseDown={(e) => {
                  setIsModalConfirmAddPrescriptionToCartOpen(true);
                  e.preventDefault();
                }}
              >
                tambah ke keranjang
              </div>
            </div>
          </div>
        )}
        {isModalConfirmAddPrescriptionToCartOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '25vh',
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
              Apakah anda yakin ingin memasukkan resep ke keranjang ?
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
                onClick={() =>
                  setIsModalConfirmAddPrescriptionToCartOpen(false)
                }
              >
                cek lagi..
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
                  handlePostCartFromPrescription();
                  e.preventDefault();
                }}
              >
                ya, masukkan ke keranjang..
              </div>
            </div>
          </div>
        )}
        {isModalOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: 'max-content',
              width: 'max-content',
              backgroundColor: 'white',
              padding: '100px',
              borderRadius: '5px',
              boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
              zIndex: '15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <input
              id='file-input'
              type='file'
              style={{
                display: 'none',
              }}
              onChange={(e) => handleInputValueFileChange(e)}
            />

            <label
              htmlFor='file-input'
              style={{
                border: '1px dashed red',
                width: '200',
                height: '200',
                display: 'flex',
                justifyContent: 'center',
                padding: '30px',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <UploadFile />
              <div>{previewUrl || fileCoba ? '' : 'lampirkan file'}</div>
            </label>
            {previewUrl && (
              <Image
                height={130}
                width={130}
                src={previewUrl}
                alt='Preview Gambar'
              />
            )}
            {fileCoba && (
              <div
                style={{ width: '300px', height: '300px', overflow: 'hidden' }}
              >
                <Document file={fileCoba} loading={<div>Loading...</div>}>
                  <Page pageNumber={1} width={300} height={300} />
                </Document>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
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
                onClick={() => handleClickClose()}
              >
                tutup
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
                }}
                onClick={() => postCloudinary()}
              >
                kirim
              </div>
            </div>
          </div>
        )}
      </ChatRoomPage>
    </>
  );
}

export default ChatPage;
