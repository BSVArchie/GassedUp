import { useState } from 'react';
import './App.css';
import GassPump from './GassPump';
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
import { pubKey2Addr, PubKey, DefaultProvider, bsv, PandaSigner, hash160, PubKeyHash, toByteString, Signer, Scrypt } from 'scrypt-ts';
import { GassedupApp } from './contracts/gassedupApp'
// import { getDefaultSigner } from '../tests/utils/txHelper'
import * as dotenv from 'dotenv'



const App: React.FC = () => {

  const [prePayState, setPrePayState] = useState(false)
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [currentTxId, setCurrentTxId] = useState('')


  function handleCash() {
    alert('Bitcoin (electronic cash) is more convenient, try it out!!')
  }


  function handleCard() {
    alert('Trusted third parties are expensive, try Bitcoin!!')
  }


  const deployContract = async () => {

      const provider = new DefaultProvider({
          network: bsv.Networks.testnet
      })

      const signer = new PandaSigner(provider)

      const { isAuthenticated, error } = await signer.requestAuth()

      if (!isAuthenticated) {
          alert(`Gass pump not connected: ${error}`)
      } else {
          // const connectedAddr = hash160((await signer.getDefaultPubKey()).toHex())
          setOpen(true)
      }

      const buyerAddr = PubKeyHash(toByteString('0000000000000000000000000000000000000000'))
      const gassStationAddr = PubKeyHash('02eec213d43ed5be4f73af118aa5b71cad2451c674dc09375a141bab85cf2b3ab7')
      const gassPumpAddr = PubKeyHash((await signer.getDefaultPubKey()).toHex())


      const instance = new GassedupApp(buyerAddr, gassStationAddr, gassPumpAddr, prePayState)

      await instance.connect(signer)

      try {
        const deployTx = await instance.deploy(1)
        setCurrentTxId(deployTx.id)
        alert(`Deployed Contract: ${deployTx.id}`)
    } catch (error) {
        console.log(error)
    }

    console.log(currentTxId)
  }


  const prePay = async () => {

    // try {
    //   const signer = getDefaultSigner()
    //   // await signer.connect()
    //   const tx = await signer.connectedProvider.getTransaction(currentTxId)
    // } catch (error) {
    //   console.log(error)
    // }


      // const buyerAddr = pubKey2Addr(PubKey('0265b58951db762e755d6f5b19eacb79dc59bd08c3692c99dfaff707c56fec54b9'))


      // setOpen(false)

  }


  const cancel = () => {
      setOpen(false)
  }

  return (
    <div className="App">
      <Container sx={{ border: '6px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant='h2' sx={{ m: 1 }}>
          Gassed Up
        </Typography>
        <Box width='80%' sx={{
            border: '3px solid black',
            color: '#666666',
            display: 'flex',
            // flexDirection: 'column',
            // flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0.25rem',
            textAlign: 'left',
            m: 'auto',
          }}>
          <Box>
            <ol>
              <li>
                Connect Wallet/Select Bitcoin
              </li>
              <li>
                Submit Amount
              </li>
              <li>
                Select Grade
              </li>
              <li>
                Press START button to begin pumping
              </li>
              <li>
                Press STOP button to finish pumping
              </li>
              <li>
                Press FINISH button to complete transaction
              </li>
            </ol>
          </Box>
          <Container sx={{ width: '30%', display: 'flex', flexDirection: 'column'}}>
            <Button variant="contained" sx={{ m: 1, bgcolor: 'green', "&:hover": { bgcolor: 'green' } }} onClick={() => handleCash()}>$ Cash</Button>
            <Button variant="contained" sx={{ m: 1 }} onClick={() => handleCard()}>Visa</Button>

            <Button onClick = {deployContract} variant="contained" sx={{ m: 1, bgcolor: 'gold', "&:hover": { bgcolor: 'gold' } }} >Bitcoin</Button>

            <Dialog open={open} fullWidth>
                <DialogTitle>Enter Amount</DialogTitle>
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
                    <Button onClick = {prePay} color='success' variant='contained'>Pre-pay</Button>
                    <Button onClick = {cancel} color='error' variant='contained'>Cancel</Button>
                </DialogActions>
            </Dialog>
          </Container>
        </Box>
        {/* <GassPump/> */}
        <GassPump currentTxId={currentTxId} amount={amount}/>
      </Container>
    </div>
  );
}

export default App;
