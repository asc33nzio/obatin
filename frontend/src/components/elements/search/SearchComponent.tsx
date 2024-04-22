import SearchIcon from '@mui/icons-material/Search';
import { SearchContainer } from '../../../styles/homepage/Search.style';

const SearchComponent = ():React.ReactElement => {
  return (
    <SearchContainer>
      <SearchIcon />
      <p>Cari produk di sini</p>
    </SearchContainer>
  );
};

export default SearchComponent;
