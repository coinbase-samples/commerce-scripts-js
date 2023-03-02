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
const passphrase = process.env.EXCHANGE_ACCESS_PASSPHRASE;
const accessKey = process.env.EXCHANGE_ACCESS_KEY;
const secret = process.env.EXCHANGE_SECRET;
const baseURL = process.env.EXCHANGE_BASE_URL;

const requestPath = '/profiles/';
const method = 'GET';
const url = baseURL + requestPath;

const message = timestamp + method + requestPath; // + data;
const key = Buffer.from(secret, 'base64');
const hmac = crypto.createHmac('sha256', key);
const signature = hmac.update(message).digest('base64');

async function getProfileID() {
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
    });
    const data = await response.json();
    const profileID = data[0].id;
    console.log(profileID);
  } catch (error) {
    console.log(error);
  }
}

getProfileID();
