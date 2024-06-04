import React from 'react';
import styled from 'styled-components';

function Footer() {
    return (
        <StyledFooter>
            <small>
                &copy; {new Date().getFullYear()} - Project made for{' '}
                <a
                    target="_blank"
                    href="https://vnukchatting.site" rel="noopener noreferrer"
                >
                    Sentiment Analysis
                </a>
            </small>
        </StyledFooter>
    );
}

const StyledFooter = styled.footer`
  width: 100%;
  height: 3rem;
  padding: 0.9rem;
  text-align: center;
  background-color: #770000;
  color: #FFFFFF;
  position:fixed;
  bottom:0;
  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Footer;
