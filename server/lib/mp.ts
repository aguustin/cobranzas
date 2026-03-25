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

//25/03/2026

/**
 * 
 * esto puede ir dentro de response.status en caso de fallar lo otro:
 * 
 * // Aquí ya puedes continuar tu lógica, por ejemplo, devolver un success al frontend

 //const qrString = `https://www.mercadopago.com/instore/merchant/qr/product/${process.env.MP_USER_ID}/SUC005POS001`;
 
 // 2. Generamos la imagen Base64
 /*const posConfigResponse = await fetch(
    `https://api.mercadopago.com/pos?external_id=SUC005POS001`, 
    {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    }
  );
const posData = await posConfigResponse.json();
console.log(posData)
// 2. Extraemos el qr_code nativo (suele empezar con '000201...')
// Si posData.results[0] existe, usamos su qr_code
const nativeQrCode = posData.results[0]?.qr_code;*/

// 3. Generamos la imagen con ese string exacto
//const qrImage = await QRCode.toDataURL(nativeQrCode); */
