import express, {Router} from "express";
import bodyParser from "body-parser";
import {Order} from "../entity/Order";
import {Err, HttpCode} from "../helper/Err";
import {log} from "util";
import {OrderController} from "../controller/OrderController";

require("dotenv").config()

const router = Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)
router.post('/create-checkout-session', async (req, res) => {

    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.userId.toString(),
            orderId: req.body.orderId.toString(),
            cart: JSON.stringify(req.body.products.toString()),
        }
    })

    console.log('hello')

    const line_items = req.body.products.map(p => {
        return {
            price_data: {
                currency: 'cad',
                product_data: {
                    name: p.title,
                    images: [p.image]
                },
                unit_amount: p.price * 100,
            },
            quantity: p.quantity,
        }
    })

    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        customer: customer.id,
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/shop/mybag`,
    });
    res.send({url: session.url});
});

// update order payment status
const updateOrderStatus = async (customer, data) => {
    // todo
    console.log(`update order ${customer.metadata.orderId} with customer id ${customer.metadata.userId} to paid`)
    try {
        let order = await Order.findOneOrFail({where: {id: customer.metadata.orderId}, relations: ['user', 'payment'] })

        if (order.user.id.toString() !==  customer.metadata.userId) {
            throw ((new Err(HttpCode.E400, `order id ${customer.metadata.orderId} does not belong to user id ${customer.metadata.userId}`)))
        }

        order.status = 'processed'
        order.payment.status = 'paid'
        order.payment.paymentId = data.payment_intent
        order.payment.customerId = data.customer

        try {
            const updatedOrder = await order.save()
            console.log('order updated--->', updatedOrder)
        } catch (e) {
            console.log('error when updating: ', e)
        }

    } catch (e) {
        throw ((new Err(HttpCode.E400, `invalid order id ${customer.metadata.orderId}`, e)))
    }
}

// webhook

router.post('/webhook',  (request, response) => {
    const sig = request.headers['stripe-signature'];
    const allType = []

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.ENDPOINT_SECRET);
        console.log("✅ Stripe event constructed ");
    } catch (err) {
        console.log(`❌ Stripe event construction failed, error message: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            stripe.customers.retrieve(checkoutSessionCompleted.customer).then(customer => {
                console.log(customer)
                // console.log('data==>', checkoutSessionCompleted)
                updateOrderStatus(customer, checkoutSessionCompleted).then(() => {
                    console.log('order updated!')
                }).catch(e => console.log('error when updating order', e));
            }).catch(e => console.log(e.message))
            break;
        case 'payment_intent.created':
            const paymentIntentCreated = event.data.object;
            // todo update payment id here
            // Then define and call a function to handle the event payment_intent.created
            break;
        // ... handle other event types
        default:
            allType.push(event.type)
            console.log(`Unhandled event type: `, allType);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
});


export default router