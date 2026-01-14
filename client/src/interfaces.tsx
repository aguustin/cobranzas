

export interface SignInBody {
    email: string;
    username: string;
    password: string;
    confirmPassword:string
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface CreateProductBody {
    storeId:string;
    productName:string;
    productPrice:number;
    productCategory:string;
    productDiscount:number;
    productQuantity:number;
    productTaxe:number
}