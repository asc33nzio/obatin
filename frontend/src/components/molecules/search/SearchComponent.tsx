import { SearchContainer } from '@/styles/pages/homepage/Search.style';
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent = ():React.ReactElement => {
  return (
    <SearchContainer>
      <SearchIcon />
      <p>Cari produk di sini</p>
    </SearchContainer>
  );
};

export default SearchComponent;
