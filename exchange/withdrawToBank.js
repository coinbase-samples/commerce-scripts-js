/**
 * Copyright 2023-present Coinbase Global, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const crypto = require('crypto');
const timestamp = Date.now() / 1000; // in ms
const passphrase = process.env.EXCHANGE__ACCESS_PASSPHRASE;
const accessKey = process.env.EXCHANGE__ACCESS_KEY;
const secret = process.env.EXCHANGE__SECRET; //Exchange API Secret
const profileID = process.env.EXCHANGE_PROFILE_ID; //Exchange Profile ID
const paymentMethod = process.env.PAYMENT_ID; //This is the ID associated w/ your business banking account
const baseURL = process.env.EXCHANGE_BASE_URL;

const requestPath = '/withdrawals/payment-method/';
const transferAmount = '3.5'; //Amount to be transfered to your bank account
const method = 'POST';

const url = baseURL + requestPath;
const data = JSON.stringify({
  profile_id: profileID,
  amount: transferAmount,
  payment_method_id: paymentMethod,
  currency: 'USD',
});

const message = timestamp + method + requestPath + data;
const key = Buffer.from(secret, 'base64');
const hmac = crypto.createHmac('sha256', key);
const signature = hmac.update(message).digest('base64');

async function withdrawToBankAccount() {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'CB-ACCESS-KEY': accessKey,
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-PASSPHRASE': passphrase,
      },
      body: data,
    });
    const res = await response.json();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
withdrawToBankAccount();
