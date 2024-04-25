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

    // update this PublicKey with your GasPump's PubKey (see getPubKey.js)
    this.gasPumpPublicKey = PubKey(toByteString("023d63daaf3f2c63462563a14cac33b8fb7742ff61148285fdc7a9a8bc308c75ee"))
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

    let outputs = buyerOutput
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
    const buyerChange: number = current.balance - Number(totalPrice)
    console.log('buyerChange:', buyerChange)

    const unsignedTx: bsv.Transaction = new bsv.Transaction()
    .addInput(current.buildContractInput())

    // .addOutput(
    //     new bsv.Transaction.Output({
    //         script: bsv.Script.fromHex(
    //             Utils.buildPublicKeyHashScript(current.gassStationAddr)
    //         ),
    //         satoshis: Number(totalPrice)
    //     })
    // )

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
