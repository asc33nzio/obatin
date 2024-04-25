import { useState } from 'react';

export const useUploadValidation = () => {
  const [userUpload, setUserUpload] = useState<Blob | undefined>(undefined);
  const [userUploadValidationError, setUserUploadValidationError] =
    useState<string>('');

  const validateUpload = (input: Blob | undefined) => {
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

  const handleCertificateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const userUpload = event?.target?.files?.[0];
    setUserUpload(userUpload);
    validateUpload(userUpload);
  };

  return {
    userUpload,
    setUserUpload,
    userUploadValidationError,
    setUserUploadValidationError,
    validateUpload,
    handleCertificateChange,
  };
};
