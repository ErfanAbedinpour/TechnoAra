export interface ICreatePayment {
    data: {
        authority: string;
    }
}


export interface IVerifyPayment {
    data: {
        code: number;
        message: string;
        card_hash: string;
        card_pan: string;
        ref_id: number;
        fee_type: string;
        fee: number;
        shaparak_fee: number;
        order_id: number
    }
}