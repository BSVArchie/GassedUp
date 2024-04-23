import { useState } from 'react';
import './App.css';
<<<<<<< HEAD
import GassPump from './GassPump';
import Token from './Token';
=======
import GasPump from './GasPump';
>>>>>>> 75482b4a9822c218a8d5bded0cb1d091e21888c7
// import QRCode from 'qrcode.react';
import {
  Typography,
  Container,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField
} from '@mui/material';
import { pubKey2Addr, PubKey, DefaultProvider, bsv, PandaSigner, SensiletSigner, hash160, PubKeyHash, toByteString, Signer, Scrypt, toHex } from 'scrypt-ts';
import { GassedupApp } from './contracts/gassedupApp'
import * as dotenv from 'dotenv'

const App: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [currentTxId, setCurrentTxId] = useState('')

  function handleCash() {
    alert('Bitcoin (electronic cash) is more convenient, try it out!!')
  }

  function handleCard() {
    alert('Trusted third parties are expensive, try Bitcoin!!')
  }

  function preAuthorizePayment() {
    alert('Pre-authorizing 200 Satoshis for gas')
    preAuthorizationTx(200n)
  }

  const preAuthorizationTx = async (amount: bigint) => {
    const provider = new DefaultProvider({
      network: bsv.Networks.testnet
    })

    // the Buyer uses Panda/Yours Wallet
    const signer = new PandaSigner(provider)

    const { isAuthenticated, error } = await signer.requestAuth()

    if (!isAuthenticated) {
      alert(`Buyer's Yours wallet is not connected: ${error}`)
    } else {
      const gassStationAddr = PubKeyHash('02eec213d43ed5be4f73af118aa5b71cad2451c674dc09375a141bab85cf2b3ab7')

      const buyerPubKey = PubKey(toHex(await signer.getDefaultPubKey()))
      const buyerAddress = pubKey2Addr(buyerPubKey)

      const instance = new GassedupApp(buyerAddress, amount)

      await instance.connect(signer)

      try {
        instance.deploy(Number(amount)).then((result) => {
          setCurrentTxId(result.id)
          console.log(`Deployed Contract: ${result.id}`)
          alert(`Deployed Pre-authContract: ${result.id}`)
        })
      } catch (error) {
        console.log(error)
      }

      console.log(currentTxId)
    }
  }

  return (
    <div className="App">
      <Container sx={{ border: '6px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 1 }}>
          <Typography variant='h2' sx={{ m: 2 }}>
            Gassed Up
          </Typography>
          <Box sx={{}}>
            <Token/>
          </Box>
        </Box>
        <Box width='80%' sx={{
          border: '3px solid black',
          color: '#666666',
          display: 'flex',
          justifyContent: 'center',
          padding: '0.25rem',
          textAlign: 'left',
          m: 'auto',
        }}>
          <Box>
            <ol>
              <li>
                Select Bitcoin, and connect Yours Wallet
              </li>
              <li>
                Get pre-authorized for 200 Sats of gas
              </li>
              <li>
                Select which gas octane
              </li>
              <li>
                Press START to begin pumping
              </li>
              <li>
                Press STOP to finish pumping
              </li>
              <li>
                Press FINISH to complete transaction
              </li>
            </ol>
          </Box>
          <Container sx={{ width: '30%', display: 'flex', flexDirection: 'column'}}>
            <Button variant="contained" sx={{ m: 1, bgcolor: 'green', "&:hover": { bgcolor: 'green' } }} onClick={() => handleCash()}>Cash</Button>
            <Button variant="contained" sx={{ m: 1 }} onClick={() => handleCard()}>Visa</Button>
            <Button
              onClick={preAuthorizePayment}
              variant="contained"
              sx={{ m: 1, bgcolor: '#EAB300', "&:hover": { bgcolor: '#EEC233' } }}>
              Bitcoin
            </Button>

            <Dialog open={open} fullWidth>
<<<<<<< HEAD
                <DialogTitle>Enter Pre-pay Amount</DialogTitle>
                <DialogContent>
                    <TextField onChange = { e => setAmount(Number(e.target.value))} label="Satoshis"></TextField>
                </DialogContent>
                    {/* <Box textAlign="center" mb={4}>
                        <Typography>
                        Please scan the QR code below to make a payment of amount BSV to the following address:
                        </Typography>
                        <Typography variant="subtitle1">{arbiterAddr}</Typography>
                    </Box>
                    <Box onChange={handleAmount} display="flex" justifyContent="center">
                        <QRCode value={`bitcoin:${arbiterAddr}?amount=${amount}&message=Please%20provide%20your%20address`} size={256} />
                    </Box> */}
                <DialogActions>
                    <Button onClick = {deployContract} color='success' variant='contained'>Pre-pay</Button>
                    <Button onClick = {cancel} color='error' variant='contained'>Cancel</Button>
                </DialogActions>
=======
              <DialogTitle>Enter Amount</DialogTitle>
              <DialogContent>
                <TextField onChange = { e => setAmount(Number(e.target.value))} label="Satoshis"></TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick = {preAuthorizePayment} color='success' variant='contained'>Pre-auth</Button>
              </DialogActions>
>>>>>>> 75482b4a9822c218a8d5bded0cb1d091e21888c7
            </Dialog>
          </Container>
        </Box>
        <GasPump currentTxId={currentTxId} amount={amount}/>
      </Container>
    </div>
  );
}

export default App;