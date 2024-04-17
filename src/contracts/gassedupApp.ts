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
} from 'scrypt-ts'

export class GassedupApp extends SmartContract {
    @prop(true)
    buyerAddr: Addr

    @prop()
    readonly gassStationAddr: Addr

    @prop()
    readonly gassPumpAddr: Addr

    @prop(true)
    prePayState: boolean

    @prop(true)
    prePayAmount: bigint


    constructor(buyerAddr: Addr, gassStationAddr: Addr, gassPumpAddr: Addr) {
        super(...arguments)
        this.buyerAddr = buyerAddr
        this.gassStationAddr = gassStationAddr
        this.gassPumpAddr = gassPumpAddr
        this.prePayState = false
        this.prePayAmount = BigInt(0)
    }

    @method()
    // SigHash.ANYONECANPAY_SINGLE
    // public prePay(buyerSig: Sig, buyerPubkey: PubKey, prePayAmount: bigint) {
    public prePay(prePayAmount: bigint) {
        // assert(this.checkSig(buyerSig, buyerPubkey), 'buyer signature check failed')
        // this.buyerAddr = pubKey2Addr(buyerPubkey)
        assert(prePayAmount > 0, 'A minimum of 1 Satoshi is required to start pump')

        // this.prePayState = true
        // this.buyerAddr = buyerAddr

        let outputs = this.buildStateOutput(this.ctx.utxo.value)
        outputs = Utils.buildPublicKeyHashOutput(this.gassPumpAddr, prePayAmount)
        outputs += this.buildChangeOutput()
        assert(hash256(outputs) == this.ctx.hashOutputs)
    }

    static prePayTxBuilder(
        current: GassedupApp,
        options: MethodCallOptions<GassedupApp>,
        prePayAmount: bigint
    ): Promise<ContractTransaction> {

        const next = options.next as StatefulNext<GassedupApp>
        // const nextInstance = current.next()
        // nextInstance.prePayState = true
        // nextInstance.buyerAddr = buyerAddr


        const unsignedTx: bsv.Transaction = new bsv.Transaction()
        .addInput(current.buildContractInput())

        .addOutput(
            new bsv.Transaction.Output({
                script: next.instance.lockingScript,
                satoshis: Number(prePayAmount)
            })
        )

        if (options.changeAddress) {
            unsignedTx.change(options.changeAddress)
        }

        return Promise.resolve({
            tx: unsignedTx,
            atInputIndex: 0,
            nexts: [
                {
                    instance: next.instance,
                    atOutputIndex: 0,
                    balance: Number(prePayAmount),
                },
            ]
        })
    }

}
