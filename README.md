# E-Wallet API

An E-Wallet API written with Node.js, Typescript and Knex.js

Author: [Okeowo Demilade](https://github.com/D4C-lolu/)

## Context and Scope

The E-wallet API is a backend for a hypothetical mobile peer-to-peer base lending service. Users may receive loans in the wallet from other users and transfer money into their wallets from other financial services. Funds may also be deposited from user accounts to commercial bank accounts.

## Goals

- Creating a service that users can sign up to, log in and make deposits from.
- Allow transactions without double spending.
- Ensure proper authorization and authentication measures are in place to safeguard each user's wallet.
- Extensively test the application and measure metrics to guarantee appropriate performance.

## Non-goals

- This application will not have integration with any real financial services.
- Will not provide a means to track 'debtors'.

## Design

The API for the service is a rather simple one witth only 3 models: a 'Users' model for each user, an 'Accounts' model containing the fiscal balance and pin information of each user. It is related to the User model via a foreign key 'account_user' referencing the 'user_id' of the User model. The last model is the 'Transactions' model representing every transfer that occurs.

### [DB Model](https://dbdesigner.page.link/DTYzGfBBN53Ai6ci6)

![DataBase UML diagram](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.countryliving.com%2Flife%2Fg32106800%2Fsunset-quotes%2F&psig=AOvVaw13im4k4OFpxdKJC6kZEASB&ust=1665476812320000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCICFxeCe1foCFQAAAAAdAAAAABAE)

## Existing Solutions

Several E-wallet lending solutions already exist such as [Carbon](https://https://ng.getcarbon.co/), [Branch](https://https://branch.com.ng/) and [FairMoney](https://https://fairmoney.ng/).
However, most of these require a centralized party dispensing the loans. This service instead allows users to receive loans from _other_ users.

## Detailed Scoping and Timeline

- Research Knex and Wallet API design
- Bootstrap Project
- Set up models
- Implement service layer
- Implement controllers
- Testing
- Deployment
