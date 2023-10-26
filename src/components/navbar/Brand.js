import React from 'react';
import styled from "styled-components";
import sfLogo from "../../SF_LOGO.png";
import iitKgpLogo from "../../IIT-Kharagpur.png";

const Brand = () => {
  return (
    <BrandContainer>
      <LogoContainer>
        <Image src={sfLogo} alt="SF Logo" style={{ margin: '0rem 1.2rem' }} />
      </LogoContainer>
      <LogoContainer>
        <Image src={iitKgpLogo} alt="IIT Kharagpur Logo" />
      </LogoContainer>
    </BrandContainer>
  );
};

const BrandContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 0rem;
`;

const LogoContainer = styled.div`
  height: 5rem;
  margin-right: 1rem;
`;

const Image = styled.img`
  width: auto;
  height: 100%;
  // filter: brightness(3.8) saturate(4.5);
`;

export default Brand;