import { buffer } from 'micro';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let event;

    try {
      const rawBody = await buffer(req);

      let charge = url => axios.post(url, JSON.parse(rawBody), {headers: {
        'Private-Merchant-Id': process.env.PRIVATE_MERCHANT_ID,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }}).then(res => res.data);

      let response = await charge("https://api-uat.kushkipagos.com/card/v1/charges")
      res.status(200).json(response);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.data.message}`);
      return;
    }


  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
