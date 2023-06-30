import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import EditBookForm from './EditBookForm';
import EditBookStepper from './EditBookStepper';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {xs: '100%', sm: '50%'},
  maxHeight: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll',
};

const EditBookModal = (props) => {

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          overflow: 'scroll'
        }}
      >
        <Fade in={props.open}>
          <Box sx={style}>
            <EditBookStepper onCurrencyChange={props.onCurrencyChange} showDesoPrice={props.showDesoPrice} exchangeRate={props.exchangeRate} bookData={props.bookData} handleClose={props.handleClose} handleOnFailure={props.handleOnFailure} handleOnSuccess={props.handleOnSuccess}/>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default EditBookModal;
