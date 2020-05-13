const errorMessages = require("../errorResponses/Errors.validator");
module.exports = class Payment {
  constructor() {}

  validateAmount(req, res, next) {
    let amount = req.body.amount;
    let actualAmountType = 0;
    if (amount === undefined) {
      errorMessages.emptyField("amount", amount, res);
    } else {
      if (typeof amount != "number") {
        errorMessages.invalidType(amount, actualAmountType, res);
      } else {
        return true;
      }
    }
  }

  validateEneoPaymentForm(req, res, next) {
    let amount = req.body.total_amount;
    let transactionList = req.body.transactions;
    let authHeader = req.headers.authorization;
    let callbackUrl = req.body.return_url;
    let apiKey = req.body.API_KEY;
    let transactionId = req.body.transaction_id;
    let actualIntTypes = 0;
    let actualStringTypes = "";

    //validation
    if (authHeader === undefined) {
      res.status(401).json({
        message:
          "Unauthorised user trying to get access.Make sure auth token is sent",
      });
    } else {
      if (authHeader.length < 50 || typeof authHeader != "string") {
        res.status(403).json({
          message: "Request forbidden.Invalid token sent in headers",
        });
      } else {
        if (typeof apiKey === "number") {
          res.status(403).json({
            message: "Request forbidden",
          });
        } else {
          if (apiKey === undefined) {
            res.status(401).json({
              message:
                "Unauthorised user trying to get access.Make sure Apikey is sent",
            });
          } else {
            if (apiKey.length < 25) {
              res.status(403).json({
                message: "Request forbidden",
              });
            } else {
              if (transactionList.length < 1) {
                res.status(400).json({
                  message: "Bad Request.Transaction array cannot be empty",
                });
              } else {
                if (amount === undefined) {
                  errorMessages.emptyField("amount", amount, res);
                } else {
                  if (typeof amount != "number") {
                    errorMessages.invalidType(amount, actualIntTypes, res);
                  } else {
                    if (transactionId === undefined) {
                      errorMessages.emptyField(
                        "transaction_id",
                        transactionId,
                        res
                      );
                    } else {
                      if (typeof transactionId != "number") {
                        errorMessages.invalidType(
                          transactionId,
                          actualIntTypes,
                          res
                        );
                      } else {
                        if (callbackUrl === undefined) {
                          errorMessages.emptyField(
                            "return_url",
                            callbackUrl,
                            res
                          );
                        } else {
                          if (typeof callbackUrl != "string") {
                            errorMessages.invalidType(
                              callbackUrl,
                              actualStringTypes,
                              res
                            );
                          } else {
                            if (callbackUrl.length < 10) {
                              res.status(400).json({
                                message:
                                  "Bad Request. return_url has undefined length",
                              });
                            } else {
                              for (let i = 0; i < transactionList.length; i++) {
                                if (
                                  typeof transactionList[i].bill_ref != "number"
                                ) {
                                  errorMessages.invalidType(
                                    transactionList[i].bill_ref,
                                    actualIntTypes,
                                    res
                                  );
                                } else {
                                  if (
                                    typeof transactionList[i].amount != "number"
                                  ) {
                                    errorMessages.invalidType(
                                      transactionList[i].amount,
                                      actualIntTypes,
                                      res
                                    );
                                  }
                                }
                              }

                              return true;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  validatename(req, res, next) {
    let name = req.body.username;
    let actualnameType = "";
    if (name === undefined) {
      errorMessages.emptyField("username", name, res);
    } else {
      if (typeof name != "string") {
        errorMessages.invalidType(name, actualnameType, res);
      } else {
        return true;
      }
    }
  }

  validateEmail(req, res, next) {
    let email = req.body.email;
    let actualEmailType = "";
    if (email === undefined) {
      errorMessages.emptyField("email", email, res);
    } else {
      if (typeof email != "string") {
        errorMessages.invalidType(email, actualEmailType, res);
      } else {
        return true;
      }
    }
  }

  stripeValidation(req, res, next) {
    if (
      this.validateAmount(req, res, next) &&
      this.validateEmail(req, res, next) &&
      this.validatename(req, res, next)
    ) {
      next();
    }
  }
};
