import styled from 'styled-components';
import { Card, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

export const SignupWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #eef2f7 0%, #f9fbfd 100%);
  padding: 16px;
  box-sizing: border-box;
`;

export const SignupCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  width: 100%;
  max-width: 400px;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

export const StyledAvatar = styled(Avatar)`
  margin: 12px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.palette.primary.main},
    #42a5f5
  );
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.4);
`;
