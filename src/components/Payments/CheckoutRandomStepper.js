import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import CheckoutRare from './CheckoutRare';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import CheckoutGetReservation from './CheckoutGetReservation';
import Book from '../UI/Book';
import Deso from 'deso-protocol';
import { Stack } from '@mui/system';
import QRCodePayment from './QRCodePayment';
import PaymentOptions from './PaymentOptions';
import NotEnoughFunds from './NotEnoughFunds';



const normSteps = ['Get Reservation', 'Review your order', 'Showcase Book'];
const altSteps = ['Get Reservation', 'Review your order', 'Alt Payment Option', 'QR Code', 'Showcase Book'];
const notEnoughFunds = ['Checking Wallet'];


const theme = createTheme();

const CheckoutRandomStepper = (props) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [serial, setSerial] = useState(null);
  const [bookBought, setBookBought] = useState({});
  const [currency, setCurrency] = useState(null);
  const [timesUp, setTimesUp] = useState(false);
  const [steps, setSteps] = useState(normSteps);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <CheckoutGetReservation userName={props.buyer.userName} setBook={handleBookChange}/>;
      case 1:
        return <CheckoutRare enoughFunds={props.enoughFunds} handleNotEnoughFunds={handleNotEnoughFunds} buyer={props.buyer} serial={serial} handleAltPayment={handleAltPayment} showSerial={false} bookData={props.bookData} handleOnFailure={handleOnFailure} closeFail={props.close} handleOnSuccess={props.handleOnSuccess} close={handleNext}/>;
      case 2:
        return <NotEnoughFunds buyer={props.buyer} bookData={props.bookData}/>
      case 3:
        return <PaymentOptions setCurrency={handleCurrencyChange}/>;
      case 4:
        return <QRCodePayment type={"RARE"} serial={serial} buyer={props.buyer} handleTimesUp={handleTimesUp} currency={currency} bookData={props.bookData} handleOnSuccess={props.handleOnSuccess} close={handleNext}/>;
      case 5:
        return (
          <Stack sx={{
              width: {xs: '100%', sm: '50%'},
              height: {xs: '50%', sm: '25%'}
            }}>
            <Typography sx={{paddingBottom: '10px'}} variant="h5">Here is your book! Enjoy!</Typography>
            <Book loading={false} bookData={bookBought} marketplace={false}/>
          </Stack>
        );
      default:
        throw new Error('Unknown step');
    }
  }

  const handleOnFailure = () => {
    props.handleOnFailure();
    props.close();
  }
  
  const handleNotEnoughFunds = () => {
    setActiveStep(2);
    setSteps(notEnoughFunds);
  }

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleAltPayment = () => {
    setSteps(altSteps);
    setActiveStep(3);
  }

  const handleTimesUp = () => {
    setTimesUp(true);
  };

  const handleNext = () => {
    if (activeStep === 1) {
      setActiveStep(5);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 4) {
      setCurrency(null);
    }
    if (activeStep === 2 || activeStep === 3) {
      setSteps(normSteps);
    }
    if (activeStep === 3) {
      setActiveStep(1);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleBookChange = (serial, postHashHex) => {
    setSerial(serial);
    props.bookData.postHashHex = postHashHex;
    handleNext();
  };

  React.useEffect(() => {
    const updateBook = async () => {
      const deso = new Deso();
      const request = {
        "PostHashHex": props.bookData.postHashHex
      };
       const response = await deso.posts.getSinglePost(request);
       console.log(response);
       setBookBought({
         ...props.bookData,
         cover: [response['PostFound']['ImageURLs'][0]],
         description: response['PostFound']['PostExtraData']['description'],
         subtitle: response['PostFound']['PostExtraData']['subtitle'],
       });
      //  props.bookData.cover = [response['PostFound']['ImageURLs'][0]];
      //  console.log(response['PostFound']['PostExtraData']['description']);
      //  props.bookData.description = response['PostFound']['PostExtraData']['description'];
    };

    updateBook();
  }, [serial]);

  return (
    <Box
    sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    }}
>        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <ShoppingCartTwoToneIcon />
            </Avatar>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && activeStep !== 5 && activeStep !== 1 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  {activeStep === 5 && (
                    <Button onClick={props.close} sx={{ mt: 3, ml: 1 }}>
                      Close
                    </Button>
                  )}
                  {activeStep === 3 && currency !== null && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Next
                  </Button>)}
                  {activeStep === 3 && currency === null && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Next
                  </Button>)}
                </Box>
              </React.Fragment>
          </React.Fragment>
      </Box>
  );
};

export default CheckoutRandomStepper;