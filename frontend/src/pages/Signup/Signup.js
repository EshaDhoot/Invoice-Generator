import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Grid, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SignupWrapper, SignupCard, Title } from './styles';
import TextFieldWrapper from '../../components/TextFieldWrapper';
import { pageAnimation } from '../../animations';

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
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setTimeout(() => {
      toast.success('Signup successful! Please login.');
      setSubmitting(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <SignupWrapper initial="hidden" animate="visible" exit="exit" variants={pageAnimation}>
      <Container>
        <SignupCard>
          <Title>
            <Typography variant="h4" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Get started with your invoice generator.
            </Typography>
          </Title>
          <Formik
            initialValues={INITIAL_FORM_STATE}
            validationSchema={FORM_VALIDATION}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextFieldWrapper name="name" label="Name" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldWrapper name="email" label="Email" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldWrapper name="password" label="Password" type="password" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldWrapper name="confirmPassword" label="Confirm Password" type="password" />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                      sx={{ padding: '12px' }}
                    >
                      {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          <Box mt={3}>
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </SignupCard>
      </Container>
    </SignupWrapper>
  );
};

export default Signup;