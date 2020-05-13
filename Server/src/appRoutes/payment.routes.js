/**
 * PAYMENTS ROUTING MODULE
 * Exposes all the API endpoints dealing with payments
 */

const stripe = require("stripe")("sk_test_V6FCFoUTTlJKuGmp8hdemHiK00uqvfEVuM");
const express = require("express");
const appRouter = express.Router();
const transactionModel = require("../appModels/Model");
const paymentValidator = require("../validatorMiddlewares/validators/payments.validator");
// const cors = require(cors)

let sevenpay_url = "https://sevengps.github.io/sevenpay/hostedPayment/payments";

// db_assigned_transactionId
let id;

/**
 *  SUBMITTED FORM FROM ENEO
 */
appRouter.post("/pay", (req, res, next) => {
  let receivedPaymentForm = {};
  //validator
  let validateForm = new paymentValidator();
  if (validateForm.validateEneoPaymentForm(req, res, next)) {
    receivedPaymentForm = {
      totalAmount: req.body.total_amount,
      transactionId: req.body.transaction_id,
      transactionList: req.body.transactions,
      returnUrl: req.body.return_url,
      apiKey: req.body.API_KEY,
      authHeader: req.headers.authorization,
    };
    console.log("only here", receivedPaymentForm);
    transactionModel.pendingTransactions.create(
      receivedPaymentForm,
      (error, pendingTransaction) => {
        id = pendingTransaction._id;

        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Methods",
          "GET,PUT,POST,DELETE,OPTIONS"
        );
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, Content-Length, X-Requested-With"
        );
        res.setHeader("Content-Type", "text/html");
        res.redirect("https://sevenpay.herokuapp.com/");
      }
    );
  }
});

appRouter.get("/auth", (req, res) => {
  if (id === undefined) {
    res.status(401).json({ success: false, message: "Access Denied" });
  } else {
    res.status(200).json({ success: true, message: "Access Verified", id: id });
  }
});

/**
 * REDIRECT ROUTE UPON SUCCESSFUL PAYMENT
 */
appRouter.post("/success", (req, res) => {
  if (
    receivedPaymentForm.callbackUrl != undefined &&
    receivedPaymentForm.callbackUrl.length > 2
  ) {
    res.setHeader(
      "Content-Type",
      "application/json",
      "Access-Control-Allow-Origin",
      "*"
    );
    res.status(200).redirect(receivedPaymentForm.callbackUrl);
  } else {
    res
      .status(404)
      .json({ message: "Return url not supplied. Redirection failed" });
  }
});

//STRIPE PAYMENT VALIDATOR
let stripeValidator = (req, res, next) => {
  return new paymentValidator().stripeValidation(req, res, next);
};
let amountValidator = (req, res, next) => {
  return new paymentValidator().validateAmount(req, res, next);
};

/** CREDIT CARD PAYMENT */
appRouter.post("/creditCard", stripeValidator, (req, res) => {
  try {
    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        source: req.body.id,
      })
      .then((customer) =>
        stripe.charges.create({
          amount: req.body.amount * 100,
          currency: "usd",
          customer: customer.id,
        })
      )
      .then((customer) => {
        // store transaction details to db
        transactionModel
          .create({
            amount: req.body.amount,
            transactionDate: new Date().toISOString(),
            gateway: "creditCard",
            platformId: "web",
          })
          .then((document) => {
            console.log(document);
          });
        res.json({
          success: true,
          message: "Payment was successful.",
          id: customer.id,
        });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    res.json(err);
  }
});

/** MTN MOBILE MONEY PAYMENT */
appRouter.post("/mtnMobileMoney", amountValidator, (req, res) => {
  transactionModel
    .create({
      amount: req.body.amount,
      transactionDate: new Date().toISOString(),
      gateway: "mtn",
      platformId: "web",
    })
    .then((document) => {
      res.json(document);
    });
});

/** ORANGE MOBILE MONEY PAYMENT */
appRouter.post("/orangeMobileMoney", amountValidator, (req, res) => {
  transactionModel
    .create({
      amount: req.body.amount,
      transactionDate: new Date().toISOString(),
      gateway: "orange",
      platformId: "web",
    })
    .then((document) => {
      res.json(document);
    });
});

/** EXPRESS UNION MONEY PAYMENT */
appRouter.post("/euPay", amountValidator, (req, res) => {
  transactionModel
    .create({
      amount: req.body.amount,
      transactionDate: new Date().toISOString(),
      gateway: "euPay",
      platformId: "web",
    })
    .then((document) => {
      res.json(document);
    });
});

/** YUP MOBILE MONEY PAYMENT */
appRouter.post("/yupPay", amountValidator, (req, res) => {
  transactionModel
    .create({
      amount: req.body.amount,
      transactionDate: new Date().toISOString(),
      gateway: "yup",
      platformId: "web",
    })
    .then((document) => {
      res.json(document);
    });
});

/** SAVE TRANSACTION DETAILS FROM MOBILE APP */
appRouter.post("/mobile", amountValidator, (req, res) => {
  transactionDetails = {
    amount: req.body.amount,
    transactionDate: new Date().toISOString(),
    gateway: req.body.gateway,
    platformId: "mobile",
  };
  transactionModel.create(transactionDetails).then((transaction) => {
    if (transaction._id) {
      res.json({ message: "success" });
    }
  });
});

module.exports = appRouter;
