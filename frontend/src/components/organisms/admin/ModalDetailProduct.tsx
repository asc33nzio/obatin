import { IResponseGetDetailProduct, ISales } from '@/types/Product';
import Image from 'next/image';
import React from 'react';

interface IModalDetailProduct {
  content?: string;
  confirmContent?: string;
  cancelContent?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  data: IResponseGetDetailProduct;
}

const monthObject: {
  [key: string]: string;
} = {
  January: 'Januari',
  February: 'Februari',
  March: 'Maret',
  April: 'April',
  May: 'Mei',
  June: 'Juni',
  July: 'Juli',
  August: 'Agustus',
  September: 'September',
  October: 'Oktober',
  November: 'November',
  December: 'Desember',
};

function convertMonthToBahasa(month: string) {
  return monthObject[month] || month;
}

function ModalDetailProduct(props: IModalDetailProduct) {
  return (
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
      <Image src={props.data.data.image_url} height={120} width={120} alt='' />
      <div style={{ overflowY: 'auto', height: '30vh', width: '80%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>nama</div>
            <div style={{ width: '70%' }}> {props?.data.data.name}</div>
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            <div style={{ width: '30%' }}>slug</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {' '}
              {props?.data.data.product_slug}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>nama generik</div>
            <div style={{ width: '70%' }}> {props?.data.data.generic_name}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '30%',
              }}
            >
              indikasi umum
            </div>
            <div
              style={{
                width: '70%',
              }}
            >
              {' '}
              {props?.data.data.general_indication}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>dosis</div>
            <div style={{ width: '70%' }}> {props?.data.data.dosage}</div>
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            <div style={{ width: '30%' }}>cara penggunaan</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {' '}
              {props?.data.data.how_to_use}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>efek samping</div>
            <div style={{ width: '70%' }}> {props?.data.data.side_effects}</div>
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            <div style={{ width: '30%' }}>kontraindikasi</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {' '}
              {props?.data.data.contraindication}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>peringatan</div>
            <div style={{ width: '70%' }}> {props?.data.data.warning}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>nomor bpom</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {' '}
              {props?.data.data.bpom_number}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>kandungan</div>
            <div style={{ width: '70%' }}> {props?.data.data.content}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>deskripsi</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {' '}
              {props?.data.data.description}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>klasifikasi</div>
            <div style={{ width: '70%' }}>
              {' '}
              {props?.data.data.classification}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>jumlah per kemasan</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {' '}
              {props?.data.data.packaging}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>unit jual</div>
            <div style={{ width: '70%' }}> {props?.data.data.selling_unit}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>harga maksimal</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {props?.data.data.max_price}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>harga minimum</div>
            <div style={{ width: '70%' }}>{props?.data.data.min_price}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>berat</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {props?.data.data.weight}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>tinggi</div>
            <div style={{ width: '70%' }}>{props?.data.data.height}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>lebar</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {props?.data.data.width}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>panjang</div>
            <div style={{ width: '70%' }}>{props?.data.data.length}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>apakah obat aktif</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {props?.data.data.is_active}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>apakah butuh resep</div>
            <div style={{ width: '70%' }}>
              {props?.data.data.is_prescription_required}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%' }}>nama manufaktur</div>
            <div
              style={{
                width: '70%',
              }}
            >
              {props?.data.data.manufacturer.name}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 182, 192, 0.453)',
            }}
          >
            <div style={{ width: '30%' }}>kategori</div>
            <div style={{ width: '70%' }}>
              {props?.data.data.categories.map((category) => (
                <div key={category.id}>{category.name}, </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              marginTop: '30px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              Laporan Penjualan
            </div>
            <div>
              <select
                style={{
                  backgroundColor: 'lightblue',
                  color: 'black',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                name=''
                id=''
              >
                <option value='2024'>2024</option>
              </select>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <table style={{ width: '80%' }}>
              <thead>
                <tr style={{ height: '30px' }}>
                  <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                    Bulan
                  </th>
                  <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                    Jumlah Penjualan / unit penjualan
                  </th>
                </tr>
              </thead>
              <tbody>
                {props?.data?.data?.sales?.map(
                  (item: ISales, index: number) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? 'rgba(0, 181, 192, 0.05)' : 'white',
                        height: '30px',
                        padding: '0 5px',
                      }}
                    >
                      <td
                        style={{
                          padding: '0 10px',
                          width: '20%',
                        }}
                      >
                        {convertMonthToBahasa(item.month)}
                      </td>
                      <td
                        style={{
                          padding: '0 10px',
                          width: '20%',
                        }}
                      >
                        {item.total_sales}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
        onClick={() => props.onCancel && props.onCancel()}
      >
        Tutup
      </div>
    </div>
  );
}

export default ModalDetailProduct;
