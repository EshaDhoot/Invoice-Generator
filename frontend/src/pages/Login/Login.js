import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Grid, Typography, Button, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { LoginWrapper, LoginCard, StyledAvatar } from './styles';
import TextFieldWrapper from '../../components/TextFieldWrapper';
import { pageAnimation } from '../../animations';
import api from '../../api';

const Login = ({ setAuth }) => {
  const navigate = useNavigate();

  const INITIAL_FORM_STATE = {
    email: '',
    password: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string().email('Invalid email.').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/users/login', values);
      const { token } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('isAuthenticated', 'true');
      
      setAuth(true);
      toast.success('Login successful!');
      navigate('/invoice');
    } catch (error) {
      // The axios interceptor will handle displaying the specific error from the backend
      console.error('Login failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginWrapper initial="hidden" animate="visible" exit="exit" variants={pageAnimation}>
      <Container component="main" maxWidth="xs">
        <LoginCard>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            Welcome Back
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <Formik
              initialValues={INITIAL_FORM_STATE}
              validationSchema={FORM_VALIDATION}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  {/* Use a Box with flexbox and gap for perfect, responsive field alignment */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextFieldWrapper name="email" label="Email" />
                    <TextFieldWrapper name="password" label="Password" type="password" />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ mt: 3, mb: 2, padding: '12px' }}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>

                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary">
                          Don't have an account? Sign Up
                        </Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </LoginCard>
      </Container>
    </LoginWrapper>
  );
};

export default Login;