import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";


const handler = async (req, res) => {
    const session = await getSession({req});
    if(!session) {
        return res.status(401).send('Error: Debe estar registrado para acceder')
    }

    await db.connect();
    const order = await Order.findById(req.query.id);
    if(order) {
        if(order.isPaid) {
            return res.status(400).send({message: 'Error: Su compra ya fue pagada'})
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address
        }

        const paidOrder = await order.save();
        await db.disconnect();

        res.send({message: 'Orden de compra pagada exitosamente', order: paidOrder})
    } else {
        res.status(404).send({ message: 'Error: orden de compra no encontrada'})
    }
}

export default handler;