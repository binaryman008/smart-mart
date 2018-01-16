const router = require('express').Router()
const {Order, LineItem} = require('../db/models')
module.exports = router

router.post('/', (req, res, next) => {
  console.log(req.body.cart)
  let cartAmount = req.body.cart.total *100

  let lineItems = []
  req.body.cart.myCart.forEach(item => {
    console.log(item)
    lineItems.push({productId: item.id, quantity: item.quantity})
  })
  const orderData = req.body.checkout
  orderData.lineItems = lineItems
  const userId = req.body.user.id
  if (userId) {
    orderData.userId = userId
  }
  console.log(orderData)

  var stripe = require("stripe")("sk_test_kzTrRvfkJwIqeqdHXbuNQYHj");

  // // Token is created using Checkout or Elements!
  // // Get the payment token ID submitted by the form:
  var token = req.body.token; // Using Express
  console.log('token before stripe create', token)
  // Charge the user's card:
  new Promise ((resolve, reject) => {
    stripe.charges.create({
      amount: cartAmount,
      currency: "usd",
      description: "Example charge",
      source: token,
    }, function(err, charge) {
      if (err) return reject(err)
      else return resolve()
    });
  })
    .then(() => {
      console.log('line Item', LineItem)
      Order.create(orderData, {include: LineItem})
    })
})
