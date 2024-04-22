import { COLORS } from "@/constants/variables";
import styled from "styled-components";

export const Body = styled.div`
    min-width: 100vh;
    padding: 2rem 5rem;
    align-items:center;
`

export const Content = styled.div`
    display: flex;
    flex: 1;
`

export const FiturContainer = styled.div`
    padding: 5rem;
    display: flex;
    justify-content: center;
    gap: 2rem;
`

export const Fitur = styled.div`
    padding: 20px;
    width: 400px;
    border: 1px solid ${COLORS.input_border};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    justify-content: space-between;
`

export const Title = styled.h1`
    color: ${COLORS.primary_color};
    font-weight: 700;
`

export const NewSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
`

export const Container = styled.div`
    width: 100%;
    padding: 20px 5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    align-content: center;
`


export const Imagecontainer = styled.img`
    width: 150px;
`

export const ProductCard = styled.div`
    width: 270px;
    height: 330px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid ${COLORS.input_border};
    border-radius: 12px;
    padding: 20px;
    justify-content: space-between;
`

export const Bold = styled.p`
    font-weight: 700;
    font-size: 19px;
`

export const Smallfont = styled.p`
    color: #A5A5A5;
    font-size: 14px;
`
export const ArrowRight = styled.div`
    color: ${COLORS.primary_color};
`