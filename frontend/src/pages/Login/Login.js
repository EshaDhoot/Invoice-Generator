import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Grid, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginWrapper, LoginCard, Title } from './styles';
import TextFieldWrapper from '../../components/TextFieldWrapper';
import { pageAnimation } from '../../animations';

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

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    // Mock login
    setTimeout(() => {
      if (values.email === 'test@test.com' && values.password === 'password') {
        toast.success('Login successful!');
        localStorage.setItem('isAuthenticated', 'true');
        setAuth(true);
        navigate('/invoice');
      } else {
        toast.error('Invalid email or password.');
      }
      setSubmitting(false);
    }, 1000);
  };

  return (
    <LoginWrapper initial="hidden" animate="visible" exit="exit" variants={pageAnimation}>
      <Container>
        <LoginCard>
          <Title>
            <Typography variant="h4" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Login to continue.
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
                    <TextFieldWrapper name="email" label="Email" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldWrapper name="password" label="Password" type="password" />
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
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          <Box mt={3}>
            <Typography variant="body2">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </Typography>
          </Box>
        </LoginCard>
      </Container>
    </LoginWrapper>
  );
};

export default Login;