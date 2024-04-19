import React from 'react'
import { SearchContainer } from '../../../styles/homepage/Search.styles'
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent = () => {
  return (
    <SearchContainer>
        <SearchIcon/>
        <p>Cari produk di sini</p>
    </SearchContainer>
  )
}

export default SearchComponent
