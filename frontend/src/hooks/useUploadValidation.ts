import { useState } from 'react';

export const useUploadValidation = () => {
  const [userUpload, setUserUpload] = useState<Blob | undefined>(undefined);
  const [userUploadValidationError, setUserUploadValidationError] =
    useState<string>('');

  const validatePdfUpload = (input: Blob | undefined) => {
    if (input === undefined) {
      setUserUploadValidationError(
        'Anda harus mengunggah sertifikat untuk mendaftar',
      );
      return false;
    }

    if (input.type !== 'application/pdf') {
      setUserUploadValidationError(
        'Format gambar salah. Hanya boleh mengunggah .pdf',
      );
      return false;
    }

    if (input.size > 1 * 500 * 1000) {
      setUserUploadValidationError('Ukuran file tidak boleh lebih dari 500kb');
      return false;
    }

    setUserUploadValidationError('');
    return true;
  };

  const validateImageUpload = (input: Blob | undefined) => {
    if (input === undefined) {
      setUserUploadValidationError('Gambar tidak terpilih');
      return false;
    }

    const allowedExtenstions = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    let validExtension: boolean = false;
    allowedExtenstions.map((extension) => {
      if (input.type === extension) {
        validExtension = true;
      }
    });

    if (!validExtension) {
      setUserUploadValidationError(
        'Format gambar salah. Hanya boleh mengunggah .JPG .JPEG .PNG .WEBP',
      );
      return false;
    }

    if (input.size > 1 * 500 * 1000) {
      setUserUploadValidationError('Ukuran file tidak boleh lebih dari 500kb');
      return false;
    }

    setUserUploadValidationError('');
    return true;
  };

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userUpload = event?.target?.files?.[0];
    if (validatePdfUpload(userUpload)) {
      setUserUpload(userUpload);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userUpload = event?.target?.files?.[0];
    if (validateImageUpload(userUpload)) {
      setUserUpload(userUpload);
    }
  };

  return {
    userUpload,
    setUserUpload,
    userUploadValidationError,
    setUserUploadValidationError,
    validatePdfUpload,
    validateImageUpload,
    handlePdfChange,
    handleImageChange,
  };
};
