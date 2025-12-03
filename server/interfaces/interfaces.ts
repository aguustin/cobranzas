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
    productQuantity: number;
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