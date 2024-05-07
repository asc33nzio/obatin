import React from 'react';
import {
  CategoryDropdown,
  Dropdown,
  ItemContainer,
} from '@/styles/molecules/Dropdown.styles';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DoctorSpecType } from '@/types/doctorTypes';
import Image from 'next/image';

const SpecializationComponent = ({
  specializations,
  setSpecSlug,
}: {
  specializations: DoctorSpecType[];
  setSpecSlug: (specSlug: string) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSpecializationClicked = (specSlug: string) => {
    setSpecSlug(specSlug);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const renderSpecialization = (specializations: DoctorSpecType[]) => {
    return specializations.map((data) => (
      <Dropdown key={data.id}>
        <ItemContainer
          onClick={(e) => {
            e.preventDefault();
            handleSpecializationClicked(data.slug);
            router.push(
              pathname +
                '?' +
                createQueryString('specialization', `${data.slug}`),
            );
          }}
        >
          <Image
            height={50}
            width={50}
            src={data.image_url}
            alt='specialization'
          />
          <a
          // onClick={(e) => {
          //   e.preventDefault();
          //   handleSpecializationClicked(data.slug);
          //   router.push(
          //     pathname +
          //       '?' +
          //       createQueryString('specialization', `${data.slug}`),
          //   );
          // }}
          >
            {data.name}
          </a>
        </ItemContainer>
      </Dropdown>
    ));
  };

  return (
    <CategoryDropdown>{renderSpecialization(specializations)}</CategoryDropdown>
  );
};

export default SpecializationComponent;
