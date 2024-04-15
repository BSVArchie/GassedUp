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
} from 'scrypt-ts'

export class GassedupApp extends SmartContract {
    @prop()
    readonly buyerAddr: PubKeyHash

    @prop()
    readonly gasstationAddr: Addr

    constructor(buyerAddr: PubKeyHash, gasstationAddr: Addr) {
        super(...arguments)
        this.buyerAddr = buyerAddr
        this.gasstationAddr = gasstationAddr
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public completeTransaction(totalPrice: bigint, buyerChange: bigint) {
        let outputs = Utils.buildPublicKeyHashOutput(this.gasstationAddr, totalPrice)
        outputs += Utils.buildPublicKeyHashOutput(this.buyerAddr, buyerChange)
        assert(this.ctx.hashOutputs === hash256(outputs), 'hashOutputs mismatch')
    }
}
