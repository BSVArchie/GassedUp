import GasPump from 'GasPump';
import { Address } from 'cluster';
import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    SigHash,
    Addr,
    Utils,
    PubKeyHash,
    Sig,
    PubKey,
    bsv,
    pubKey2Addr,
    MethodCallOptions,
    ContractTransaction,
    StatefulNext,
    ByteString,
    toByteString,
    hash160,
    toHex,
} from 'scrypt-ts'

export class GassedupApp extends SmartContract {
  // Gas Pump will be paid by Sensilet wallet - which has PrivKey, PubKey, and Address
  // Gas Pump is responsible for providing the initial SmartContract template to the Buyer
  // @prop()
  // readonly gasPumpAddress: Addr

  @prop()
  readonly gasPumpPublicKey: PubKey


  // Gas pump will send the send payment to the gas station address after each transaction
  // This is similar to moving money from the register to a safe for security and more efficient accounting
  @prop()
  readonly gasStationPubKey: Addr

  // Buyer is going to pay with Yours Wallet - which has PrivKey, PubKey, and Address
  // Buyer signs the initial SmartContract deploy (with the prepayment)
  @prop(true)
  buyerAddress: Addr

  // Buyer is going to pre-pay a certain amount of Satoshis
  // This is similar to the current state of things;
  //   how a buyer's credit card is pre-charged $200 before getting gas
  @prop(true)
  prepaymentAmount: bigint

  constructor(buyerAddress: Addr, prepaymentAmount: bigint) {
    super(...arguments)
    this.buyerAddress = buyerAddress
    this.prepaymentAmount = prepaymentAmount

    this.gasStationPubKey = Addr(toByteString("02735235e7a21112c33c2cad159fc9ac1c8529624ce8769580462159d1ace47a10"))

    // update this PublicKey with your GasPump's PubKey (see getPubKey.js)
    this.gasPumpPublicKey = PubKey(toByteString("02bdac4af01dfdfbd98e656e254613f23c0b7c537882edca4cae95cf5bd0713997"))
  }

  // TODO 2: also enable Buyer to redeem the SmartContract in an exception case.

  // after Buyer spends X satoshis on gas
  // return the unspent satoshis to the Buyer's address
  @method()
  public completeTransaction(totalPrice: bigint, sig: Sig) {
    // ensure only the GasPump can spend the SmartContract
    assert(this.checkSig(sig, this.gasPumpPublicKey), 'checkSig failed')
    assert(this.prepaymentAmount >= totalPrice, 'Error: totalPrice is more than the Buyer prepaid for')
    const buyerChange: bigint = this.prepaymentAmount - totalPrice

    const buyerOutput: ByteString = Utils.buildPublicKeyHashOutput(this.buyerAddress, buyerChange)
    const gasStationOutput: ByteString = Utils.buildAddressOutput(hash160(this.gasStationPubKey), totalPrice)

    let outputs = gasStationOutput + buyerOutput
    // build the change output back to the GasPump
    if (this.changeAmount > BigInt(0)) {
      outputs += this.buildChangeOutput()
    }
    assert(hash256(outputs) == this.ctx.hashOutputs, 'hash outputs do not match')
  }

  static completeTxBuilder(
      current: GassedupApp,
      options: MethodCallOptions<GassedupApp>,
      totalPrice: bigint
  ): Promise<ContractTransaction> {
    const buyerChange: number = Number(current.balance) - Number(totalPrice)
    console.log('buyerChange:', buyerChange)

    const unsignedTx: bsv.Transaction = new bsv.Transaction()
    .addInput(current.buildContractInput(options.fromUTXO))

    .addOutput(
      new bsv.Transaction.Output({
          script: bsv.Script.fromHex(
              Utils.buildPublicKeyHashScript(hash160(current.gasStationPubKey))
          ),
          satoshis: Number(totalPrice)
      })
    )

    .addOutput(
      new bsv.Transaction.Output({
        script: bsv.Script.fromHex(
            Utils.buildPublicKeyHashScript(current.buyerAddress)
        ),
        satoshis: Number(buyerChange)
      })
    )

    if (options.changeAddress) {
        unsignedTx.change(options.changeAddress)
    }

    return Promise.resolve({
        tx: unsignedTx,
        atInputIndex: 0,
        nexts: []
    })
  }

}
