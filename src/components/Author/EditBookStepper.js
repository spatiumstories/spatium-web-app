import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Review from './Review';
import FinalConfirm from './FinalConfirm';
import NewBookForm from './NewBookForm';
import RoyaltiesForm from './RoyaltiesForm';
import { Stack } from '@mui/system';
import Book from '../UI/Book';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Deso from 'deso-protocol';
import EditBookForm from './EditBookForm';
import EditBookConfirm from './EditBookConfirm';

const steps = ['Book Details', 'Confirmation'];


const theme = createTheme();

const EditBookStepper = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [newDetails, setNewDetails] = useState(null);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleDetailsChange = (details) => {
    setNewDetails(details);
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <EditBookForm setDetails={handleDetailsChange} details={newDetails} showDesoPrice={props.showDesoPrice} exchangeRate={props.exchangeRate} bookData={props.bookData} handleClose={props.handleClose} handleOnFailure={props.handleOnFailure} handleOnSuccess={props.handleOnSuccess} handleNext={handleNext}/>;
      case 1:
          return <EditBookConfirm details={newDetails} exchangeRate={props.exchangeRate} book={props.bookData}/>;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Editing Your Book!
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Stack sx={{
                width: {xs: '100%', sm: '50%'},
                height: {xs: '50%', sm: '25%'}
            }}>
                <Typography sx={{paddingBottom: '10px'}} variant="h5">Congrats! Your Book is Published!</Typography>
                <Book loading={false} bookData={props.bookData} marketplace={false}/>
            </Stack>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default EditBookStepper;