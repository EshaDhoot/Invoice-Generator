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
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AnimatePresence, motion } from 'framer-motion';

import Header from '../../components/Header';
import TextFieldWrapper from '../../components/TextFieldWrapper';
import { pageAnimation, itemAnimation } from '../../animations';
import {
  InvoiceWrapper,
  SectionCard,
  TotalsWrapper,
  TotalsCard,
  TotalRow,
} from './styles';
import api from '../../api';

const Invoice = ({ setAuth }) => {
  const INITIAL_FORM_STATE = {
    clientName: '',
    clientEmail: '',
    products: [
      {
        name: '',
        quantity: 1,
        rate: 0,
      },
    ],
  };

  const FORM_VALIDATION = Yup.object().shape({
    clientName: Yup.string().required('Client name is required'),
    clientEmail: Yup.string()
      .email('Invalid email')
      .required('Client email is required'),
    products: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        quantity: Yup.number()
          .min(1, 'Quantity must be at least 1')
          .integer('Quantity must be a whole number')
          .required('Required'),
        rate: Yup.number().min(0, 'Rate cannot be negative').required('Required'),
      })
    ),
  });

  const calculateTotals = (products) => {
    const subtotal = products.reduce(
      (acc, item) => acc + (item.quantity * item.rate || 0),
      0
    );
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const handleGeneratePdf = async (values, { setSubmitting, resetForm }) => {
    toast.info('Generating PDF...');
    try {
      const { clientName, clientEmail, products } = values;

      const response = await api.post(
        '/invoices/generate-pdf',
        {
          products: products.map((p) => ({
            name: p.name,
            quantity: p.quantity,
            rate: p.rate,
          })),
          clientName,
          clientEmail,
        },
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'invoice.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch?.length === 2) filename = filenameMatch[1];
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF Generated Successfully!');
      resetForm();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('PDF Generation Failed!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header setAuth={setAuth} />
      <InvoiceWrapper
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageAnimation}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, textAlign: 'center', mb: 3, color: 'primary.main' }}
          >
            Create New Invoice
          </Typography>

          <Formik
            initialValues={INITIAL_FORM_STATE}
            validationSchema={FORM_VALIDATION}
            onSubmit={handleGeneratePdf}
          >
            {({ values, isSubmitting }) => {
              const { subtotal, gst, total } = calculateTotals(values.products);

              return (
                <Form>
                  {/* Client Details */}
                  <SectionCard>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                    >
                      Client Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextFieldWrapper name="clientName" label="Client Name" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextFieldWrapper name="clientEmail" label="Client Email" />
                      </Grid>
                    </Grid>
                  </SectionCard>

                  {/* Products */}
                  <SectionCard>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                    >
                      Products
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <FieldArray name="products">
                      {({ push, remove }) => (
                        <TableContainer
                          component={Paper}
                          sx={{
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          }}
                        >
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
                                {values.products.map((item, index) => (
                                  <motion.tr
                                    key={index}
                                    layout
                                    variants={itemAnimation}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    style={{
                                      borderBottom: '1px solid #f0f0f0',
                                    }}
                                  >
                                    <TableCell>
                                      <TextFieldWrapper
                                        name={`products.${index}.name`}
                                        label="Product"
                                        size="small"
                                        sx={{
                                          width: {
                                            xs: '100px',   
                                            sm: '140px', 
                                            md: '180px', 
                                            lg: '220px'
                                          },
                                        }}

                                      />
                                    </TableCell>

                                    <TableCell align="right">
                                      <TextFieldWrapper
                                        name={`products.${index}.quantity`}
                                        label="Qty"
                                        type="number"
                                        size="small"
                                        inputProps={{ min: 1 }}
                                        sx={{
                                          width: { xs: '70px', sm: '100px' },
                                        }}
                                      />
                                    </TableCell>

                                    <TableCell align="right">
                                      <TextFieldWrapper
                                        name={`products.${index}.rate`}
                                        label="Rate"
                                        type="number"
                                        size="small"
                                        inputProps={{ min: 0 }}
                                        sx={{
                                          width: { xs: '70px', sm: '100px' },
                                        }}
                                      />
                                    </TableCell>

                                    <TableCell align="right">
                                      <Typography variant="body2" fontWeight={500}>
                                        ₹{(item.quantity * item.rate).toFixed(2)}
                                      </Typography>
                                    </TableCell>

                                    <TableCell align="center">
                                      <IconButton
                                        color="error"
                                        onClick={() => remove(index)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </motion.tr>
                                ))}

                              </AnimatePresence>
                            </TableBody>
                          </Table>
                          <Box p={2} textAlign="center">
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() =>
                                push({ name: '', quantity: 1, rate: 0 })
                              }
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
                        <Typography variant="body1" color="textSecondary">
                          Subtotal:
                        </Typography>
                        <Typography variant="body1">
                          ₹{subtotal.toFixed(2)}
                        </Typography>
                      </TotalRow>
                      <TotalRow>
                        <Typography variant="body1" color="textSecondary">
                          GST (18%):
                        </Typography>
                        <Typography variant="body1">₹{gst.toFixed(2)}</Typography>
                      </TotalRow>
                      <TotalRow
                        sx={{ borderTop: '1px solid #eee', paddingTop: '12px' }}
                      >
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                      </TotalRow>
                    </TotalsCard>
                  </TotalsWrapper>


                  <Box mt={4} textAlign="center">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
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
