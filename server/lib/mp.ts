const MercadoPago = require("mercadopago");

MercadoPago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// 👇 Forzamos el tipo porque el SDK no expone bien instore en TS
export const mp: any = MercadoPago;