import { MercadoPagoConfig, PreApproval, Payment } from "mercadopago";
import InstoreOrders from "mercadopago";

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const preApproval = new PreApproval(mp);
export const paymentClient = new Payment(mp);