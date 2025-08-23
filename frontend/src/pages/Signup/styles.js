import styled from 'styled-components';
import { Card, Box } from '@mui/material';
import { motion } from 'framer-motion';

export const SignupWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f9fc 0%, #eef1f5 100%);
`;

export const SignupCard = styled(Card)`
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

export const Title = styled(Box)`
  margin-bottom: 24px;
`;