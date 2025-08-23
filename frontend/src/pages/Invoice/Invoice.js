import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AnimatePresence, motion } from 'framer-motion';

import Header from '../../components/Header';
import TextFieldWrapper from '../../components/TextFieldWrapper';
import { pageAnimation, itemAnimation } from '../../animations';
import { InvoiceWrapper, SectionCard, TotalsWrapper, TotalsCard, TotalRow } from './styles';

const Invoice = ({ setAuth }) => {
  const INITIAL_FORM_STATE = {
    clientName: '',
    clientEmail: '',
    items: [
      {
        productName: '',
        quantity: 1,
        rate: 0,
      },
    ],
  };

  const FORM_VALIDATION = Yup.object().shape({
    clientName: Yup.string().required('Client name is required'),
    clientEmail: Yup.string().email('Invalid email').required('Client email is required'),
    items: Yup.array().of(
      Yup.object().shape({
        productName: Yup.string().required('Product name is required'),
        quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Required'),
        rate: Yup.number().min(0, 'Rate must be positive').required('Required'),
      })
    ),
  });

  const calculateTotals = (items) => {
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate || 0), 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };
  
  const handleGeneratePdf = (values) => {
     toast.info("Generating PDF...");
     // Here you would make an API call to your backend
     console.log("Invoice Data:", values);
     // Mock backend response
     setTimeout(() => {
        toast.success("PDF Generated Successfully!");
     }, 2000);
  }

  return (
    <>
      <Header setAuth={setAuth} />
      <InvoiceWrapper initial="hidden" animate="visible" exit="exit" variants={pageAnimation}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Create New Invoice
          </Typography>

          <Formik
            initialValues={INITIAL_FORM_STATE}
            validationSchema={FORM_VALIDATION}
            onSubmit={handleGeneratePdf}
          >
            {({ values, isSubmitting }) => {
              const { subtotal, gst, total } = calculateTotals(values.items);

              return (
                <Form>
                  <SectionCard>
                    <Typography variant="h6" gutterBottom>
                      Client Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextFieldWrapper name="clientName" label="Client Name" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextFieldWrapper name="clientEmail" label="Client Email" />
                      </Grid>
                    </Grid>
                  </SectionCard>

                  <SectionCard>
                    <Typography variant="h6" gutterBottom>
                      Products
                    </Typography>
                    <FieldArray name="items">
                      {({ push, remove }) => (
                        <TableContainer component={Paper} elevation={0}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Rate</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <AnimatePresence>
                                {values.items.map((item, index) => (
                                  <motion.tr
                                    key={index}
                                    layout
                                    variants={itemAnimation}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                  >
                                    <TableCell>
                                      <TextFieldWrapper name={`items.${index}.productName`} label="Product" size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                      <TextFieldWrapper name={`items.${index}.quantity`} label="Qty" type="number" size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                      <TextFieldWrapper name={`items.${index}.rate`} label="Rate" type="number" size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography>
                                        ${(item.quantity * item.rate).toFixed(2)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <IconButton color="secondary" onClick={() => remove(index)}>
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </motion.tr>
                                ))}
                              </AnimatePresence>
                            </TableBody>
                          </Table>
                          <Box mt={2}>
                             <Button
                                startIcon={<AddIcon />}
                                onClick={() => push({ productName: '', quantity: 1, rate: 0 })}
                              >
                                Add Item
                              </Button>
                          </Box>
                        </TableContainer>
                      )}
                    </FieldArray>
                  </SectionCard>

                  <TotalsWrapper>
                    <TotalsCard>
                      <TotalRow>
                        <Typography variant="body1" color="textSecondary">Subtotal:</Typography>
                        <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                      </TotalRow>
                      <TotalRow>
                        <Typography variant="body1" color="textSecondary">GST (18%):</Typography>
                        <Typography variant="body1">${gst.toFixed(2)}</Typography>
                      </TotalRow>
                      <TotalRow sx={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">${total.toFixed(2)}</Typography>
                      </TotalRow>
                    </TotalsCard>
                  </TotalsWrapper>

                  <Box mt={3} textAlign="center">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Generating...' : 'Generate PDF'}
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Container>
      </InvoiceWrapper>
    </>
  );
};

export default Invoice;