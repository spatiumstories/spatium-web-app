import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import Success from './Success';
import { useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import Deso from 'deso-protocol';

const Checkout = (props) => {
    console.log(props.bookData);
    const user = useSelector(state => state.user);
    const [buying, setBuying] = useState(false);
    const [nft, setNFT] = useState();
    const deso = new Deso();

    const total = (props.bookData.price / 1000000000).toFixed(2);
    const fee = 0.025 * total;
    const price = (Number(total) - Number(fee)).toFixed(2);
    // const total = (Number(price) + Number(fee)).toFixed(2);

    useEffect(() => {
        if (buying) {
            const acceptNFT = async () => {
                console.log(nft);
                const request = {
                    "UpdaterPublicKeyBase58Check": user.publicKey,
                    "NFTPostHashHex": nft,
                    "SerialNumber": 1,
                    "MinFeeRateNanosPerKB": 1000
                  };
                let successResponse = true;
                const response = await deso.nft.acceptNftTransfer(request).catch(e => {
                    successResponse = false;
                    console.log(e);
                    setBuying(false);
                    props.close();
                    props.handleOnFailure();
                });
                if (successResponse) {
                    console.log(response);
                    setBuying(false);
                    props.close();
                    props.handleOnSuccess();
                }
            };
            acceptNFT().catch(console.error);
        }
    }, [nft]);

    const onBuyHandler = async () => {
        let nft = props.bookData.postHashHex;
        let successfulPayment = true;
        // const request = {
        //     "publicKey": user.publicKey,
        //     "transactionSpendingLimitResponse": {
        //       "GlobalDESOLimit": (props.bookData.price + (props.bookData.price * 0.025)) * 1000,
        //       "TransactionCountLimitMap": {
        //         "BASIC_TRANSFER": 2,
        //       }
        //     }
        //   };
          
          
        setBuying(true);
        const requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_hash_hex: nft,
                buyer_pub_key: user.publicKey,
                buyer_prv_key: '',
                author: props.bookData.publisher,
                nanos:  props.bookData.price
            })
        };
        fetch('http://spatium-dev.us-east-1.elasticbeanstalk.com/api/buy-book', requestOptions)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            setNFT(data);
        });

        const authorPaymentRequest = {
            "SenderPublicKeyBase58Check": user.publicKey,
            "RecipientPublicKeyOrUsername": props.bookData.publisher,
            "AmountNanos": (props.bookData.price - (props.bookData.price * 0.025)),
            "MinFeeRateNanosPerKB": 1000
          };
        console.log(buying);

        const author_payment = await deso.wallet.sendDesoRequest(authorPaymentRequest).catch(e => {
            successfulPayment = false;
            setBuying(false);
            props.close();
            props.handleOnFailure();
        });

        if (successfulPayment) {
            console.log("sending fee payment");
            const feePaymentRequest = {
                "SenderPublicKeyBase58Check": user.publicKey,
                "RecipientPublicKeyOrUsername": "BC1YLg9piUDwrwTZfRipfXNq3hW3RZHW3fJZ7soDNNNnftcqrJvyrbq",
                "AmountNanos": props.bookData.price * 0.025,
                "MinFeeRateNanosPerKB": 1000
            };
            const fee_payment = await deso.wallet.sendDesoRequest(feePaymentRequest).catch(e => {
                successfulPayment = false;
                setBuying(false);
                props.close();
                props.handleOnFailure();
            });
        }
        // const response = await deso.identity.derive(request);
        // console.log(response);

        const requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_hash_hex: nft,
                buyer_pub_key: user.publicKey,
                buyer_prv_key: '',
                author: props.bookData.publisher,
                nanos:  props.bookData.price
            })
        };

        if (successfulPayment) {
            fetch('http://spatium-dev.us-east-1.elasticbeanstalk.com/api/buy-book', requestOptions)
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    setNFT(data);
                });
        }
    }

    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <ShoppingCartTwoToneIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Checkout
            </Typography>
                <Grid container sx={{ paddingTop: '20px', width: '100%'}}>
                    <Grid item xs={6} alignItems='flex-start'>
                        <Typography variant="h6">{props.bookData.title} x1</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6">{price} DeSo</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{paddingTop: '10px'}}>
                        <Typography variant="h6">Spatium Stories Fee</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6">{fee} DeSo</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{paddingTop: '10px'}}>
                        <Typography variant="h5">Total</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5">{total} DeSo</Typography>
                    </Grid>
                </Grid>
                <LoadingButton
                    loading={buying}
                    onClick={onBuyHandler}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Complete Purchase!
                </LoadingButton>
        </Box>
    );
};

export default Checkout;