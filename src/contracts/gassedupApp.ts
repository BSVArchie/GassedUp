import GassPump from 'GassPump';
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
    @prop(true)
    buyerPubKey: PubKey

    @prop()
    readonly gassStationAddr: Addr

    @prop()
    readonly gassPumpPubKey: PubKey

    constructor(gassStationAddr: Addr, buyerPubKey: PubKey) {
        super(...arguments)
        this.buyerPubKey = buyerPubKey
        this.gassStationAddr = gassStationAddr
        this.gassPumpPubKey = PubKey(toByteString('0000000000000000000000000000000000000000'))
    }

    @method()
    public completeTransaction(totalPrice: bigint) {
        assert(this.ctx.utxo.value > 0, 'A minimum of 1 Satoshi is required to start pump')

        const buyerChange: bigint = this.ctx.utxo.value - totalPrice

        const stationOutput: ByteString = Utils.buildPublicKeyHashOutput(this.gassStationAddr, totalPrice)
        const buyerOutput: ByteString = Utils.buildPublicKeyHashOutput(hash160(this.buyerPubKey), buyerChange)

        let outputs = stationOutput + buyerOutput
        if (this.changeAmount > 0n) {
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

        .addOutput(
            new bsv.Transaction.Output({
                script: bsv.Script.fromHex(
                    Utils.buildPublicKeyHashScript(current.gassStationAddr)
                ),
                satoshis: Number(totalPrice)
            })
        )

        .addOutput(
            new bsv.Transaction.Output({
                script: bsv.Script.fromHex(
                    Utils.buildPublicKeyHashScript(hash160(current.buyerPubKey))
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



// @method(SigHash.ANYONECANPAY_ALL)
    // public prePay(buyerPubKey: PubKey) {
    //     this.buyerPubKey = buyerPubKey
    //     // assert(this.checkSig(buyerSig, buyerPubKey), 'buyer signature check failed')
    //     // this.buyerAddr = pubKey2Addr(buyerPubkey)

    //     assert(this.ctx.utxo.value > 0, 'A minimum of 1 Satoshi is required to start pump')

    //     let outputs = this.buildStateOutput(this.ctx.utxo.value)
    //     // outputs += Utils.buildPublicKeyHashOutput(hash160(this.gassPumpPubKey), prePayAmount)
    //     // if (this.changeAmount > 0n) {
    //     //     outputs += this.buildChangeOutput()
    //     // }

    //     assert(hash256(outputs) == this.ctx.hashOutputs)
    //     // assert(0 == 0, 'hash mismatch')
    // }
