import { useState } from 'react';
import { CategoryDropdown, Dropdown } from '@/styles/molecules/Dropdown.styles';
import { CategoryType } from '@/types/Product';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';

const CategoryComponent = ({
  categories,
  setCategoryId,
  setParentPage,
}: {
  categories: CategoryType[];
  setCategoryId: (categoryId: number) => void;
  setParentPage: () => void;
}): React.ReactElement => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories((prevExpandedCategories) =>
      prevExpandedCategories.includes(categorySlug)
        ? prevExpandedCategories.filter((slug) => slug !== categorySlug)
        : [...prevExpandedCategories, categorySlug],
    );
  };

  const handleSetSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete('sort_by');
    params.delete('classification');
    params.delete('order');
    params.delete('page');
    params.delete('search');
    params.set(key, value);
    router.replace(`${pathName}?${params.toString()}`);
  };

  const handleCategoryClicked = (categoryId: number) => {
    handleSetSearchParams('category', categoryId.toString());
    setCategoryId(categoryId);
    setParentPage();
  };

  const renderCategories = (categories: CategoryType[]) => {
    return categories.map((category) => (
      <Dropdown key={category.id}>
        <div>
          <a
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClicked(category.id);
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
