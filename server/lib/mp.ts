import { MercadoPagoConfig, PreApproval, Payment } from "mercadopago";
import InstoreOrders from "mercadopago";

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const preApproval = new PreApproval(mp);
export const paymentClient = new Payment(mp);



//12/02/2026
/*const mpResponse = await preference.create({
  body: {
    external_reference: orderId,
    items: [
      {
        id: storeId,
        title: "Venta de productos",
        quantity: 1,
        unit_price: Number(totalToPay)
      }
    ],
    notification_url: "https://03ae-200-32-101-183.ngrok-free.app/api/payments/webhook",
    back_urls: {
      success: "https://tu-web.com/success",
      failure: "https://tu-web.com/failure",
      pending: "https://tu-web.com/pending"
    },
  }
});*/