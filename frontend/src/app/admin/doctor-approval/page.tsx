'use client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import EditIcon from '@/assets/admin/EditIcon';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useToast } from '@/hooks/useToast';
import Pagination from '@/components/molecules/admin/Pagination';
import TableRow from '@/components/molecules/admin/TableHover';
import DeleteIcon from '@/assets/admin/DeleteIcon';
import ModalConfirmation from '@/components/molecules/admin/ModalConfirmation';
import NavbarAdmin from '@/components/organisms/navbar/NavbarAdmin';

export interface IPendingDoctorPagination {
  page: number;
  page_count: number;
  total_records: number;
  limit: number;
}

export interface IPendingDoctorResponse {
  message: string;
  data: IPendingDoctorResponseData[];
  pagination: IPendingDoctorPagination;
}

export interface IPendingDoctorResponseData {
  authentication_id: number;
  email: string;
  ceritificate_url: string;
  specialization_name: string;
  specialization_description: string;
}

function AdminDoctorApproval() {
  const [refetchPendingDoctor, setRefetchPendingDoctor] =
    useState<boolean>(true);

  const [isApprove, setIsApprove] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedDoctorAuthId, setSelectedDoctorAuthId] = useState<
    number | null
  >(null);

  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const [inputLimitValue, setInputLimitValue] = useState<string>('');
  const [paramLimitValue, setParamLimitValue] = useState<number>(10);
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] =
    useState<boolean>(false);

  useEffect(() => {
    setSelectedPage(1);
    setParamLimitValue(10);
  }, []);

  const handleClickPage = (page: number) => {
    setSelectedPage(page);
    setRefetchPendingDoctor(false);
    setIsLoading(true);

    setTimeout(() => {
      setRefetchPendingDoctor(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleClickEdit = (authId: number) => {
    setIsModalConfirmationOpen(true);
    setSelectedDoctorAuthId(authId);
    setIsApprove(true);
  };

  const handleClickDelete = (authId: number) => {
    setIsModalConfirmationOpen(true);
    setSelectedDoctorAuthId(authId);
    setIsApprove(false);
  };

  const handleClickButtonConfirm = async (isApprove: boolean) => {
    await postApprovePendingDoctor(isApprove);
    setIsModalConfirmationOpen(false);
  };

  const handleClickButtonCancel = () => {
    setIsModalConfirmationOpen(false);
  };

  const handleClickLimit = () => {
    if (inputLimitValue !== '') {
      if (isNaN(parseInt(inputLimitValue)) || parseInt(inputLimitValue) <= 0) {
        setToast({
          showToast: true,
          toastMessage: 'input harus berupa angka dan positif',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      if (parseInt(inputLimitValue) > 25) {
        setToast({
          showToast: true,
          toastMessage: 'maksimum limit data adalah 25',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
    }
    if (inputLimitValue === '') {
      setParamLimitValue(10);
    }
    if (inputLimitValue !== '') {
      setParamLimitValue(parseInt(inputLimitValue));
    }
    setRefetchPendingDoctor(false);
    setIsLoading(true);
    setSelectedPage(1);
    setTimeout(() => {
      setRefetchPendingDoctor(true);
      setIsLoading(false);
    }, 1000);
  };

  const accessToken = getCookie('access_token');

  const postApprovePendingDoctor = async (isApprove: boolean) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/approve/${selectedDoctorAuthId}?approve=${isApprove}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setToast({
        showToast: true,
        toastMessage: isApprove
          ? 'berhasil menerima dokter'
          : 'berhasil menolak dokter',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: isApprove
          ? 'gagal menerima dokter'
          : 'gagal menolak dokter',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const { isDesktopDisplay } = useClientDisplayResolution();

  const { setToast } = useToast();

  const fetcherGetPendingDoctor = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const {
    data: dataApprovalDoctor,
    error: errorGetApprovalDoctor,
    isLoading: loadingGetDataApprovalDoctor,
  } = useSWR<IPendingDoctorResponse>(
    refetchPendingDoctor
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctor-pending-approval?page=${selectedPage}&limit=${paramLimitValue}`
      : null,
    fetcherGetPendingDoctor,
  );

  useEffect(() => {
    console.log(errorGetApprovalDoctor);
  }, [errorGetApprovalDoctor]);

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <NavbarAdmin />
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: '15px',
            justifyContent: 'space-between',
            marginTop: '-25px',
            padding: '0 20px',
          }}
        >
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>Show</div>
            <div style={{ width: '30px' }}>
              <input
                style={{ width: '100%', padding: '5px' }}
                type='text'
                value={inputLimitValue?.toString()}
                onChange={(e) => setInputLimitValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleClickLimit();
                  }
                }}
              />
            </div>
            <div>Entries</div>
          </div>
        </div>
        {isLoading || loadingGetDataApprovalDoctor ? (
          <div
            style={{
              width: '100%',
              height: '75vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {' '}
            loading....
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ height: '60px' }}>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Email
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Sertifikat
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Nama Spesialisasi
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {dataApprovalDoctor?.data?.map((item, index: number) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? 'rgba(0, 181, 192, 0.05)' : 'white',
                    height: '60px',
                    padding: '0 10px',
                  }}
                >
                  <td
                    style={{
                      padding: '0 10px',
                      width: '10%',
                    }}
                  >
                    {item.email}
                  </td>
                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    <a target='_blank' href={item.ceritificate_url}>
                      Link Sertifikat
                    </a>
                  </td>

                  <td
                    style={{
                      padding: '0 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '60px',
                    }}
                  >
                    <TableRow key={item.specialization_name} item={item} />
                  </td>

                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      <EditIcon
                        onClick={() => handleClickEdit(item.authentication_id)}
                      />
                      <DeleteIcon
                        onClick={() =>
                          handleClickDelete(item.authentication_id)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isModalConfirmationOpen && (
          <ModalConfirmation
            content={
              isApprove
                ? 'apakah anda ingin menerima dokter ini?'
                : 'apakah anda yakin ingin menolak dokter ini?'
            }
            onCancel={() => handleClickButtonCancel()}
            onConfirm={() =>
              isApprove
                ? handleClickButtonConfirm(true)
                : handleClickButtonConfirm(false)
            }
          />
        )}
        {!isLoading && dataApprovalDoctor && dataApprovalDoctor.pagination && (
          <div style={{ padding: '30px 0' }}>
            <Pagination
              currentPage={dataApprovalDoctor.pagination.page}
              totalPages={dataApprovalDoctor.pagination.page_count}
              onPageChange={(page) => handleClickPage(page)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDoctorApproval;
