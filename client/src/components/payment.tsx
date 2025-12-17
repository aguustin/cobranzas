/*import { CardPayment } from "@mercadopago/sdk-react";
import { subscriptionRequest } from "../api/managerRequests";

const Subscription = () => {

    const subscriptionFunc = async () => {
        const formData = new FormData()
        formData.append('cardToken', token)
        formData.append('email', email)
        
        const res: number = await subscriptionRequest(formData)
    }

    return(
        <> 
            <CardPayment
                initialization={initialization}
                onSubmit={subscriptionFunc}
                onError={(err) => console.error(err)}
                onReady={() => console.log("Brick listo")}
            />
        </>
    )
}

export default Subscription*/