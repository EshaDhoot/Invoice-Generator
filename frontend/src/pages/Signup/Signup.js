import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { SignupWrapper, SignupCard, StyledAvatar } from './styles';
import TextFieldWrapper from '../../components/TextFieldWrapper';
import { pageAnimation } from '../../animations';
import api from '../../api/index';

const Signup = () => {
  const navigate = useNavigate();

  const INITIAL_FORM_STATE = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email.').required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { name, email, password } = values;
      await api.post('/users/register', { name, email, password });
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      console.error('Signup failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignupWrapper initial="hidden" animate="visible" exit="exit" variants={pageAnimation}>
      <SignupCard>
        <StyledAvatar>
          <LockOutlinedIcon />
        </StyledAvatar>

        <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Create Your Account
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Sign up to get started with our platform
        </Typography>

        <Box sx={{ mt: 2, width: '100%' }}>
          <Formik
            initialValues={INITIAL_FORM_STATE}
            validationSchema={FORM_VALIDATION}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextFieldWrapper name="name" label="Name" />
                  <TextFieldWrapper name="email" label="Email" />
                  <TextFieldWrapper name="password" label="Password" type="password" />
                  <TextFieldWrapper
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 3,
                    mb: 2,
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                  }}
                >
                  {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </Button>

                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary">
                        Already have an account? Login
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </SignupCard>
    </SignupWrapper>
  );
};

export default Signup;
