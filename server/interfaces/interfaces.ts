interface MonthI {
    monthDate: Date;
    monthMount: number;
    taxesMount: number;
}

export interface ProductI {
    storeId: string;
    productId: string;
    productName: string;
    productPrice: number;
    productCategory: string;
    productColor: string;
    ProductBrand: string,
    productQuantity: number;
    productDiscount: number;
    productTaxe: number;
    totalSells?: number;
    totalTaxes?: number;
    subTotalMonthEarned?: number;
    totalMonthEarned?: number;
    months: MonthI[];
    subTotalEarned?: number;
    totalEarned?: number;
    active:boolean;
}

export interface ClientProductsI{
    clientProductName:{type: Number},
    clientProductBrand:{type: String},
    clientProductQuantity:{type: Number},
    totalSpent:{type: Number},
    clientPaymentType:{type: Number}
}

export interface ClientI{
    clientName?:string;
    phone?:Date;
    email?:string;
    clientProducts?: ClientProductsI[];
    giftCard?:number;
    active: boolean;
}


export interface GiftCardI{
    giftCode:string,
    giftMount:number
}