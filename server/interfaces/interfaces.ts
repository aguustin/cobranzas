/*-------------------------------------------------------- interfaces para el modelo de PRODUCTOS ------------------------------------------------------------*/

interface MonthI {
    monthDate: Date;
    monthMount: number;
    taxesMount: number;
}

interface SizeI{
    sizeSm:string;
    sizeS:string;
    sizeM:string;
    sizeL:string;
    sizeXL:string;
    sizeXXL:string;
    sizexXXL:string;
}

interface ColorI{
    color:string;
    quantity:number;
    sizes:SizeI[];
}


export interface ProductI {
    storeId: string;
    productId: string;
    productName: string;
    productPrice: number;
    productCategory: string;
    productImg: string;
    sizes: ColorI[];
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

/*-------------------------------------------------------- interfaces para el modelo de CATEGORIAS ------------------------------------------------------------*/

export interface CategoryI{
    categoryName: string;
    categoryNumber: number;
}


/*-------------------------------------------------------- interfaces para el modelo de CLIENTES ------------------------------------------------------------*/


export interface ClientProductsI{
    clientProductName:{type: Number},
    clientProductBrand:{type: String},
    clientProductQuantity:{type: Number},
    totalSpent:{type: Number},
    clientPaymentType:{type: Number}
}

export interface ClientI{
    storeId: string;
    clientName?:string;
    phone?:Date;
    email?:string;
    clientProducts?: ClientProductsI[];
    giftCard?:number;
    active: boolean;
}

/*-------------------------------------------------------- interfaces para el modelo de SELLS (ventas) ------------------------------------------------------ */
export interface SellI{
    storeId: string;
    sproductId:string;
    sellDate:Date;
    sellUnityPrice:number;
    sellQuantity:number;
    sellSubTotal:number;
    sellTaxes:number;
    sellTotal:number;
    cupon:number;
    discount:number;
    paymentType:string;
    ticketNumber:string;
    ticketEmisionDate:Date;
    storeName:string;
    cashierId:string;
}

/*-------------------------------------------------------- interfaces para el modelo de GIFTCARD ------------------------------------------------------------*/

export interface GiftCardI{
    giftCode:string,
    giftMount:number
}

export interface BoxI{
    storeId: string;
    cashierId?: string | null 
    boxName:string;
    boxNumber:string;
    location:string;
    paymentTerminal:string;
    isOpen:boolean;
    boxDate: Date;
    initialCash: number;
    totalMoneyInBox: number;
    maxDiscount:number;
    printer:string;
    allowRefunds: boolean;
    allowCashWithdrawal: boolean;
    requireManagerAuth: boolean;
    maxTransactionAmount: number;
    boxDifferenceMoney:number;
}