import { useEffect, useState } from 'react';
import { TextField, Box, Button, Container, Typography } from '@mui/material';
import { PandaSigner, DefaultProvider, ScryptProvider, toByteString, sha256, bsv, MethodCallOptions, SensiletSigner, PubKey, toHex, SignatureResponse, findSig } from 'scrypt-ts';
import { GassedupApp } from './contracts/gassedupApp';
// import { MethodCallOptions } from 'scrypt-ts'

interface GasPumpProps {
  currentTxId: string
  amount: number
}

const GasPump: React.FC<GasPumpProps> = ({ currentTxId, amount }) => {

    const [gallons, setGallons] = useState<number>(0)
    const [octanePrice, setOctanePrice] = useState<number>(0)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [isPumping, setIsPumping] = useState(false)
    const [areButtonsDisabled, disableButtons] = useState(false)

    function setPrice(price: number) {
      setOctanePrice(price)
    }

    useEffect(() => {
      let interval: NodeJS.Timeout | null=null

      if (isPumping) {
        interval = setInterval(() => {
          setGallons((gallons: number) => Math.round((gallons + .10)*100)/100);
        }, 100); // 1000 ms = 1 second
      } else if (!isPumping && interval) {
        clearInterval(interval)
      }

      if (isPumping) {
        disableButtons(true)
      } else {
        disableButtons(false)
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [isPumping])

    useEffect(() => {
      let total = gallons * octanePrice
      if (total >= amount) {
        setIsPumping(false)
      }
      setTotalPrice(total)
    }, [gallons])

    function startPump() {
      if(!currentTxId) {
          alert('Pre-authorization payment is required, please deposit Bitcoin')
      } else if(octanePrice == 0) {
          alert('Please select an octane')
      } else if (currentTxId && octanePrice > 0)

      setIsPumping(true)
    }

    function stopPump() {
      setIsPumping(false)
    }

    const finishPumpingGas = async () => {
      const provider = new DefaultProvider({
        network: bsv.Networks.testnet
      })

      // the Gas Pump is using Sensilet
      const signer = new SensiletSigner(provider)

      // Try switching to the Your's wallet again to try and spend the GasPump's Transaction (you shouldn't be able to)
      // const signer = new PandaSigner(provider)

      const { isAuthenticated, error } = await signer.requestAuth()
      if (!isAuthenticated) {
          alert(`Gas Pump wallet not connected: ${error}`)
      }

      // get the Gas Pump's public key
      const gasPumpPublicKey = PubKey(toHex(await signer.getDefaultPubKey()))

      const atOutputIndex = 0

      const tx = await signer.connectedProvider.getTransaction(currentTxId)

      const instance = GassedupApp.fromTx(tx, atOutputIndex)

      await instance.connect(signer)
      const nextInstance = instance.next()
      instance.bindTxBuilder('completeTransaction', GassedupApp.completeTxBuilder)

      try {
        instance.methods.completeTransaction(
          BigInt(totalPrice),
          // gasPumpPublicKey,
          (sigResponses: SignatureResponse[]) => {
            return findSig(sigResponses, bsv.PublicKey.fromString(gasPumpPublicKey))
          },
          {
            next: {
              instance: nextInstance,
              balance: instance.balance
            },
            changeAddress: await signer.getDefaultAddress()
          }
        ).then((result) => {
            alert("Yay! You just got gassed up! ⛽️")
            alert(result.tx.id);
            console.log(`result: ${result.tx.id}`)
            console.log('Octane price: ', octanePrice)
            setOctanePrice(0)
            console.log('Total gallons pumped: ', gallons)
            setGallons(0)
            console.log('Total price: ', totalPrice)
            setTotalPrice(0)
        })
      } catch(error) {
        console.log(error)
      }
    }

    return (
      <>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "wrap",
            width: "88%",
          }}
        >
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "66%",
            }}
          >
            <Box
              sx={{
                border: "2px solid black",
                display: "flex",
                width: "66%",
                p: 1,
                m: 1,
              }}
            >
              <Typography>{"Octane price:"}</Typography>
            </Box>
            <Box
              sx={{
                border: "2px solid black",
                display: "flex",
                width: "18%",
                p: 1,
                m: 1,
              }}
            >
              <Typography>{`${octanePrice} Sats`}</Typography>
            </Box>
          </Container>

          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "66%",
            }}
          >
            <Box
              sx={{
                border: "2px solid black",
                display: "flex",
                width: "66%",
                p: 1,
                m: 1,
              }}
            >
              <Typography>{"Total gallons:"}</Typography>
            </Box>
            <Box
              sx={{
                border: "2px solid black",
                display: "flex",
                width: "18%",
                p: 1,
                m: 1,
              }}
            >
              <Typography>{`${gallons} Gallons`}</Typography>
            </Box>
          </Container>

          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "66%",
            }}
          >
            <Box
              sx={{
                border: "2px solid black",
                display: "flex",
                width: "66%",
                p: 1,
                m: 1,
              }}
            >
              <Typography>{"Total price: "}</Typography>
            </Box>
            <Box
              sx={{
                border: "2px solid black",
                display: "flex",
                width: "18%",
                p: 1,
                m: 1,
              }}
            >
              <Typography>{`${totalPrice} Sats`}</Typography>
            </Box>
          </Container>
        </Container>

        <Container sx={{ justifyContent: "center", display: "flex", p: 0.03 }}>
          <Box
            sx={{
              backgroundColor: "#FF6688",
              border: "4px solid black",
              display: "flex",
              flexDirection: "column",
              m: 3,
              width: 200,
              height: 260,
            }}
          >
            <Box sx={{ background: "white" }}>
              <Typography
                variant="h5"
                sx={{ p: 2, "font-family": "monospace", "font-size": "1rem" }}
              >
                10 Sats
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ p: 2 }}>
              Regular
            </Typography>
            <Typography variant="h3">87</Typography>
            <Button
              variant="contained"
              sx={{ m: 2, bgcolor: "black", "&:hover": { bgcolor: "black" } }}
              disabled={areButtonsDisabled}
              onClick={() => setPrice(10)}>
              Select
            </Button>
          </Box>

          <Box
            sx={{
              backgroundColor: "#D7D7D7",
              border: "4px solid black",
              display: "flex",
              flexDirection: "column",
              m: 3,
              width: 200,
              height: 260,
            }}
          >
            <Box sx={{ background: "white" }}>
              <Typography
                variant="h5"
                sx={{ p: 2, "font-family": "monospace", "font-size": "1rem" }}
              >
                20 Sats
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ p: 2 }}>
              Plus
            </Typography>
            <Typography variant="h3">89</Typography>
            <Button
              variant="contained"
              sx={{ m: 2, bgcolor: "black", "&:hover": { bgcolor: "black" } }}
              disabled={areButtonsDisabled}
              onClick={() => setPrice(20)}>
              Select
            </Button>
          </Box>

          <Box
            sx={{
              backgroundColor: "#558FFF",
              border: "4px solid black",
              display: "flex",
              flexDirection: "column",
              m: 3,
              width: 200,
              height: 260,
            }}
          >
            <Box sx={{ background: "white" }}>
              <Typography
                variant="h5"
                sx={{ p: 2, "font-family": "monospace", "font-size": "1rem" }}
              >
                30 Sats
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ p: 2 }}>
              Premium
            </Typography>
            <Typography variant="h3">93</Typography>
            <Button
              variant="contained"
              sx={{ m: 2, bgcolor: "black", "&:hover": { bgcolor: "black" } }}
              disabled={areButtonsDisabled}
              onClick={() => setPrice(30)}>
              Select
            </Button>
          </Box>
        </Container>

        <Container>
          <Button
            variant="contained"
            sx={{
              m: 2,
              width: "30%",
              bgcolor: "green",
              "&:hover": { bgcolor: "green" },
            }}
            onClick={() => startPump()}
          >
            Start
          </Button>
          <Button
            variant="contained"
            sx={{
              m: 2,
              width: "30%",
              bgcolor: "red",
              "&:hover": { bgcolor: "red" },
            }}
            onClick={() => stopPump()}
          >
            Stop
          </Button>
          <Button
            variant="contained"
            sx={{
              m: 2,
              width: "30%",
              bgcolor: "grey",
              "&:hover": { bgcolor: "grey" },
            }}
            onClick={() => finishPumpingGas()}
          >
            Complete
          </Button>
        </Container>
      </>
    );
}

export default GasPump
