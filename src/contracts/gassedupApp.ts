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

    constructor(buyerAddr: Addr, gassStationAddr: Addr, gassPumpAddr: Addr, prePayState: boolean) {
        super(...arguments)
        this.buyerAddr = buyerAddr
        this.gassStationAddr = gassStationAddr
        this.gassPumpAddr = gassPumpAddr
        this.prePayState = prePayState
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public prePay(buyerSig: Sig, buyerPubkey: PubKey, amount: bigint) {
        assert(this.checkSig(buyerSig, buyerPubkey), 'buyer signature check failed')
        this.buyerAddr = pubKey2Addr(buyerPubkey)

        let outputs = this.buildStateOutput(this.ctx.utxo.value)
        outputs += Utils.buildPublicKeyHashOutput(this.gassPumpAddr, amount)
        assert(hash256(outputs) == this.ctx.hashOutputs)
    }

    static prePayTxBuilder(
        current: GassedupApp,
        options: MethodCallOptions<GassedupApp>,
        prePayAmount: number
    ): Promise<ContractTransaction> {

        const next = options.next as StatefulNext<GassedupApp>

        const unsignedTx: bsv.Transaction = new bsv.Transaction()
        .addInput(current.buildContractInput())

        .addOutput(
            new bsv.Transaction.Output({
                script: bsv.Script.fromHex(
                    Utils.buildPublicKeyHashScript(current.gassStationAddr)
                ),
                satoshis: prePayAmount
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
                    balance: next.balance,
                },
            ]
        })
    }

}
