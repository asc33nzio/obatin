import { useState } from 'react';
import { CategoryDropdown, Dropdown } from '@/styles/molecules/Dropdown.styles';
import { CategoryType } from '@/types/Product';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const CategoryComponent = ({
  categories,
  setCategoryId,
}: {
  categories: CategoryType[];
  setCategoryId: (categoryId: number) => void;
}): React.ReactElement => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories((prevExpandedCategories) =>
      prevExpandedCategories.includes(categorySlug)
        ? prevExpandedCategories.filter((slug) => slug !== categorySlug)
        : [...prevExpandedCategories, categorySlug],
    );
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      params.delete('search');
      return params.toString();
    },
    [searchParams],
  );

  const handleCategoryClicked = (categoryId: number, categorySlug: string) => {
    setCategoryId(categoryId);

    router.push(
      pathname + '?' + createQueryString('category', `${categorySlug}`),
    );
  };

  const renderCategories = (categories: CategoryType[]) => {
    return categories.map((category) => (
      <Dropdown key={category.id}>
        <div>
          <a
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClicked(category.id, category.category_slug);
              toggleCategory(category.category_slug);
            }}
          >
            {category.name}
          </a>
          {expandedCategories.includes(category.category_slug) && (
            <ul>{renderCategories(category.children || [])}</ul>
          )}
        </div>
      </Dropdown>
    ));
  };

  return <CategoryDropdown>{renderCategories(categories)}</CategoryDropdown>;
};

export default CategoryComponent;
