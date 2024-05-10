'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MagnifyBlueICO from '@/assets/icons/MagnifyBlueICO';
import AttachFileICO from '@/assets/icons/AttachFileICO';
import SendChatICO from '@/assets/icons/SendChatICO';
import { ChatRoomContainer } from '@/styles/molecules/ChatRoom.styles';
import { AvatarImage } from '@/styles/atoms/AvatarImage.styles';
import { ChatRoomSection } from '@/styles/organisms/ChatRoomListContainer.styles';
import { ChatRoomPage } from '@/styles/pages/ChatRoomListContainer.styles';
import { IChatRoom } from '@/types/chatRoomItf';
import axios from 'axios';
// import useSWR, { mutate } from 'swr';
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

function TesChat(): React.ReactElement {
  const accessToken = getCookie('access_token');
  const decoded: DecodedJwtItf | null = accessToken
    ? jwtDecode(accessToken)
    : null;
  const role = decoded?.Payload?.role;
  const [inputValues, setInputValues] = useState<{
    [key: string]: string | number;
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
  const [dataSetelahMutasi, setDataSetelahMutasi] = useState<IChatRoom[]>([]);
  const [halaman, setHalaman] = useState<number>(1);
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

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = event.target.value;
    setQuantity(newQuantity);
  };

  const handleClickAddPrescription = () => {
    if (!selectedDrugParent) {
      setErrorMessageDrug('Invalid drug: please select a drug');
      return;
    }

    if (isNaN(Number(quantity)) || quantity == '' || Number(quantity) <= 0) {
      setErrorMessageQty('Invalid quantity: Please enter a positive number.');
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
      console.error('Please select a drug and enter a quantity.');
    }
  };

  const handleClickDropdownAddPrescription = () => {
    setIsModalPrescriptionOpen(true);
    setIsDropdownAttachFileOpen(!isDropdownAttachFileOpen);
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

      console.log('ini response create prescription', response);
      console.log('ini response create prescription', response.data.data.id);

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
    } catch (error) {
      console.error('Error posting prescription:', error);
    }
  };

  const handlePostCartFromPrescription = async () => {
    if (!dataPrescriptionById) {
      return;
    }
    const payload: ICartPayloadBulkAddCartFromPrescription[] =
      convertAddCartFromPrescriptionToPayload(dataPrescriptionById?.data);

    console.log(payload);
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
    } catch (error) {
      console.error('Error posting prescription:', error);
      setToast({
        showToast: true,
        toastMessage: 'Gagal menambahkan obat ke keranjang',
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

  const { data: dataChatRoom, error: errorChatRoom } = useSWR<IGetAllChatRoom>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room`,
    fetcherChatRoom,
    { refreshInterval: 5000 },
  );

  const fetcherPrescriptionById = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const { data: dataPrescriptionById, error: errorGetPrescriptionById } =
    useSWR<IResponseOneDetailPrescription>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/${selectedPrescriptionId}`,
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

  const { data: dataMessage, error: errorGetMessage } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room/${selectedIdChatRoom}`,
    fetcherMessage,
    { refreshInterval: 100 },
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

  // const updateIsTyping = async () => {
  //   try {
  //     await axios.patch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room/${selectedIdChatRoom}`,
  //       { is_typing: isTyping },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
    } catch (error) {
      console.error(error);
    }
  }, [isTyping, selectedIdChatRoom, accessToken]);

  const postMessage = async (id: number, message: string | number) => {
    try {
      // let message = inputValues['message'];

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'instant',
    });
  }, []);

  // useEffect(() => {
  //   let message = inputValues['message'];
  //   console.log(message);

  //   if (message !== '') {
  //     setIsTyping(true);
  //   } else {
  //     setIsTyping(false);
  //   }
  // }, [inputValues]);

  useEffect(() => {
    const handleIsTypingChange = () => {
      const message = inputValues['message'];
      console.log(message);
      setIsTyping(message !== '');
    };

    handleIsTypingChange(); // Call initially to handle empty state

    // Cleanup function to prevent memory leaks (optional)
    return () => {};
  }, [inputValues]);

  // useEffect(() => {
  //   setIsTyping(false);
  //   updateIsTyping();
  // }, [selectedIdChatRoom]);
  useEffect(() => {
    setIsTyping(false);
  }, []);

  useEffect(() => {
    updateIsTyping();
  }, [isTyping]);

  useEffect(() => {
    if (errorGetMessage) {
      console.log('eror get message');
      return;
    }
  }, [errorGetMessage]);

  useEffect(() => {
    if (errorGetPrescriptionById) {
      console.log('eror get message');
      return;
    }
  }, [errorGetPrescriptionById]);

  useEffect(() => {
    if (errorChatRoom) {
      return;
    }
  }, [errorChatRoom]);

  useEffect(() => {
    if (role === 'doctor') {
      setTypingText(dataMessage?.is_user_typing ? 'user is typing...' : '');
    } else if (role === 'user') {
      setTypingText(dataMessage?.is_doctor_typing ? 'doctor is typing...' : '');
    }
  }, [role, dataMessage]);

  const handleInputChange = (name: string, value: string) => {
    setInputValues({ ...inputValues, [name]: value });
  };

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
  };

  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const [showFileInputField, setShowFileInputField] = useState(false);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
  };

  useEffect(() => {
    const handleObserver = async (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        if (dataChatRoom) {
          if (halaman < dataChatRoom?.pagination?.page_count) {
            setHalaman((prev) => prev + 1);
            await fetchNextPage();
          }
        }
      }
    };
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [dataChatRoom, halaman]);

  const fetchNextPage = async () => {
    if (
      dataChatRoom &&
      dataChatRoom.data
      // halaman < dataChatRoom?.pagination?.page_count
    ) {
      const response = await fetcherChatRoom(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room?page=${halaman + 1}`,
      );
      // console.log(
      //   `FETCHING KE====> ${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room?page=${halaman + 1}`,
      // );
      // console.log(response);
      if (Array.isArray(dataChatRoom.data) && Array.isArray(response.data)) {
        // mutate(
        //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat-room?page=${halaman + 1}`,
        //   [...dataChatRoom?.data, ...response?.data],
        //   false,
        // );
        // console.log('Data setelah mutasi:', [
        //   ...dataChatRoom?.data,
        //   ...response?.data,
        // ]);

        if (halaman === 1) {
          const newData = [...dataChatRoom.data, ...response.data];
          setDataSetelahMutasi(newData);
        }
        if (halaman > 1 && dataSetelahMutasi) {
          console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
          console.log('Data setelah mutasi:', [
            ...dataSetelahMutasi,
            ...response?.data,
          ]);
          const newData = [...dataSetelahMutasi, ...response?.data];
          console.log('INI NEW DATA', newData);
          setDataSetelahMutasi(newData);
        }
      }
    }
  };

  return (
    <>
      <ChatRoomPage height='100vh' width='100vw'>
        <Navbar />
        <div style={{ display: 'flex', flexGrow: '1', marginTop: '-25px' }}>
          {/* kiri */}
          <ChatRoomSection width='30%' height='100%'>
            <div
              style={{
                width: '100%',
                height: '12%',
                backgroundColor: '#00B5C0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                <MagnifyBlueICO onClick={() => console.log('click di icon')} />
                <input style={{ padding: '10px', flexGrow: '1' }}></input>
              </div>
            </div>

            {/* list chat room */}
            {/* --------------- ini organism */}
            <ChatRoomSection height='75vh' overFlowY='auto'>
              {/* ------------- ini molecul */}
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
                            {el?.last_message}
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
              {/* {!dataSetelahMutasi &&
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
                            {el?.last_message}
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
                        <div>{el?.is_active ? 'Active' : 'Inactive'}</div>
                      </div>
                    </div>
                  </ChatRoomContainer>
                ))}
              {dataSetelahMutasi &&
                dataSetelahMutasi?.map((el: IChatRoom, index: number) => (
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
                            {el?.last_message}
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
                        <div>{el?.is_active ? 'Active' : 'Inactive'}</div>
                      </div>
                    </div>
                  </ChatRoomContainer>
                ))} */}
              <div ref={observerRef}></div>
              {/* pakai use Ref disini */}

              {/* {JSON.stringify(dataChatRoom)} */}
            </ChatRoomSection>
            {/* {JSON.stringify(dataChatRoom)} */}
          </ChatRoomSection>
          {/* kanan */}
          <ChatRoomSection width='70%' height='100%'>
            {/* --------------- ini molecule */}
            {dataMessage?.message ? (
              <>
                <ChatRoomContainer
                  width='100%'
                  gap='20px'
                  padding='20px'
                  is_shadow_active={true}
                  height='12%'
                >
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
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: '600' }}>
                            {dataMessage?.user?.name}
                          </div>
                        </div>
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
                          {role == 'doctor' && (
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
                                    height: '100px',
                                    position: 'absolute',
                                    top: '-105px',
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
                                      height: '50%',
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
                                      e.currentTarget.style.background =
                                        'white';
                                    }}
                                  >
                                    <input
                                      id='file-input' // Add the id here
                                      type='file'
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleFileChange(e)}
                                    />

                                    <label htmlFor='file-input'>
                                      lampirkan file
                                    </label>
                                  </div>
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
                                </div>
                              )}
                            </div>
                          )}
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
                                } else {
                                  console.error(
                                    'selectedIdChatRoom is undefined',
                                  );
                                }
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
                              } else {
                                console.error(
                                  'selectedIdChatRoom is undefined',
                                );
                              }
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
                }}
              >
                <NoRoomSelectedImage />
                Pilih ruang percakapan
                {/* {JSON.stringify(dataChatRoom?.pagination?.page_count)} */}
                {/* Halaman : {JSON.stringify(halaman)} */}
              </div>
            )}
          </ChatRoomSection>
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
                  // clearSelectedDrug={handleClearSelectedDrug}
                  // setDeleteFunction={setDeleteFunction}
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
                {/* {JSON.stringify(dataPrescriptionById)} */}
                {dataPrescriptionById?.data?.items?.map((el, index: number) => (
                  <div
                    key={index + 1}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      margin: '10px 0',
                      padding: '0 10px',
                      // border: '1px solid red',
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
                  // handlePostPrescription();
                  e.preventDefault();
                  // setIsModalConfirmAddPrescriptionToCartOpen(false);
                }}
              >
                ya, masukkan ke keranjang..
              </div>
            </div>
          </div>
        )}
      </ChatRoomPage>
    </>
  );
}

export default TesChat;
