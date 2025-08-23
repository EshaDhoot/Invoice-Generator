import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Paper, Box } from '@mui/material';

export const InvoiceWrapper = styled(motion.div)`
  padding: 24px;
  background-color: #f7f9fc;
  min-height: 100vh;
`;

export const SectionCard = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 12px;
`;

export const TotalsWrapper = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const TotalsCard = styled(Paper)`
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 350px;
`;

export const TotalRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;