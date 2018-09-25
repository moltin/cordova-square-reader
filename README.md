# Cordova Square Reader SDK

A Cordova plugin to interface with the native Square Reader POS SDKs.

# Install

`$ cordova plugin add @moltin/cordova-plugin-square-reader`

`$ cordova platform ios prepare` 

## Install the Square SDK

At the moment the installation process for the library does not install the Square Reader SDK's to your platforms. You'll need to follow the Square Reader SDK installation for your platform of choice - right now we only support [iOS](https://docs.connect.squareup.com/payments/readersdk/setup-ios)

# Usage

> The library does not currently deal with the Authorization Code's from Square, and requesting them via OAuth. It is recommended that as part of initialising the library, you provide an authorisation code from the Square Developers section.

## Setup

Set up the Square Reader SDK

```ts
window['squarereader'].setup(() => {
    let params = {
        "authCode": "<YOUR AUTH CODE>"
    };

    window['squarereader'].authorizeReaderSDKIfNeeded(params, () => {
        alert("Authorised!")
    },
    (err) => {
        alert(err)
    });
}, (err) => {
    alert(err);
});
```

Pair the reader POS system

```ts
window['squarereader'].pairCardReaders(() => {},
    (err) => {
        alert(err);
    }
);

```

## Charging Payments

```ts
let params = {
    "amount": "16.00"
}
window['squarereader'].startCheckout(params, () => {
    alert("Success!")
}, (err) => {
    alert(err);
});
```

## Taking Contactless Payments

In order to take contactless and card payments, you will need to ensure that you have completed your Square POS business set up on the Square dashboard. As soon as this is complete, the Square Reader system will automatically allow contactless and card payments.
