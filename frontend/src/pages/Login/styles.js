import styled from 'styled-components';
import { Card, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

export const LoginWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f9fc 0%, #eef1f5 100%);
  padding: 16px;
  box-sizing: border-box;
`;

export const LoginCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
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