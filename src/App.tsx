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

  function openModal() {
    setOpen(true)
  }

  function preAuthorizePayment() {
    alert('200 Satoshis pre-authed')
    preAuthorizationTx(200n)
  }

  const deployContract = async () => {
    const provider = new DefaultProvider({
      network: bsv.Networks.testnet
    })

      // const signer = new SensiletSigner(provider)
      const signer = new PandaSigner(provider)

      const { isAuthenticated, error } = await signer.requestAuth()

      if (!isAuthenticated) {
        alert(`Buyer's Yours wallet is not connected: ${error}`)
      } else {
        const gassStationAddr = PubKeyHash('02eec213d43ed5be4f73af118aa5b71cad2451c674dc09375a141bab85cf2b3ab7')

        const buyerPubKey = PubKey(toHex(await signer.getDefaultPubKey()))
        const buyerAddress = pubKey2Addr(buyerPubKey)
        // const gasPumpAddress: Addr = instance.gasPumpAddress

        const instance = new GassedupApp(buyerAddress, 200n)

        await instance.connect(signer)

        try {
          instance.deploy(amount).then((result) => {
            setCurrentTxId(result.id)
            setOpen(false)
            // alert(`Deployed Contract: ${result.id}`)
            console.log(`Deployed Contract: ${result.id}`)
          })
        } catch (error) {
          console.log(error)
        }

        console.log(currentTxId)
      }
  }

  const preAuthorizationTx = async (amount: bigint) => {
    const provider = new DefaultProvider({
      network: bsv.Networks.testnet
    })

      // const signer = new SensiletSigner(provider)
      const signer = new PandaSigner(provider)

      const { isAuthenticated, error } = await signer.requestAuth()

      if (!isAuthenticated) {
        alert(`Buyer's Yours wallet is not connected: ${error}`)
      } else {
        const gassStationAddr = PubKeyHash('02eec213d43ed5be4f73af118aa5b71cad2451c674dc09375a141bab85cf2b3ab7')

        const buyerPubKey = PubKey(toHex(await signer.getDefaultPubKey()))
        const buyerAddress = pubKey2Addr(buyerPubKey)
        // const gasPumpAddress: Addr = instance.gasPumpAddress

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

            <Button onClick = {openModal} variant="contained" sx={{ m: 1, bgcolor: 'gold', "&:hover": { bgcolor: 'gold' } }}>Bitcoin</Button>
            <Button onClick = {preAuthorizePayment} variant="contained" sx={{ m: 1, bgcolor: 'gold', "&:hover": { bgcolor: 'gold' } }} >Pre-auth</Button>

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
                    <Button onClick = {deployContract} color='success' variant='contained'>Pre-auth</Button>
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






  // const prePay = async () => {
  //   const provider = new DefaultProvider({

  //       network: bsv.Networks.testnet
  //   })

  //   // const signer = new PandaSigner(provider)
  //   const signer = new SensiletSigner(provider)
  //   // console.log(signer)

  //   const { isAuthenticated, error } = await signer.requestAuth()

  //     if (currentTxId && isAuthenticated) {
  //       if (!isAuthenticated) {
  //         alert(`Purchaser wallet not connected: ${error}`)
  //       }

  //       const atOutputIndex = 0
  //       const tx = await signer.connectedProvider.getTransaction(currentTxId)
  //       const instance = GassedupApp.fromTx(tx, atOutputIndex)

  //       await instance.connect(signer)

  //       // const buyerSig = await signer.getSignatures


  //       // const nextInstance = instance.next()
  //       // const buyerPubkey = await signer.getDefaultPubKey()
  //       const buyerPubKey = PubKey(toHex(await signer.getDefaultPubKey()))
  //       // const buyerAddr = pubKey2Addr(PubKey('0265b58951db762e755d6f5b19eacb79dc59bd08c3692c99dfaff707c56fec54b9'))


  //       // instance.bindTxBuilder('prePay', GassedupApp.prePayTxBuilder)

  //       try {
  //         const { tx: callTx } = await instance.methods.prePay(
  //           // buyerSig,
  //           buyerPubKey,
  //           // BigInt(amount),
  //           // {
  //           //   next: {
  //           //     instance: nextInstance,
  //           //     balance: instance.balance
  //           //   },
  //           //   changeAddress: await signer.getDefaultAddress()
  //           // }
  //         )
  //         console.log(`PrePay set for: ${amount}, new instance id: ${callTx.id}`)
  //         setCurrentTxId(callTx.id)
  //         setOpen(false)

  //       } catch(error) {
  //         // alert(`PrePay error: ${error}`)
  //         console.log(`PrePay error: ${error}`)
  //       }
  //       console.log(currentTxId)
  //     }
  // }
