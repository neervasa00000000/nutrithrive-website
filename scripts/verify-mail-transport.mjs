import assert from 'node:assert/strict';
import * as nodemailer from 'nodemailer';
// JSON transport composes the same message fields as production without SMTP,
// credentials, network requests or sending a customer email.
const result = await nodemailer.createTransport({jsonTransport:true}).sendMail({
  from:'"NutriThrive Australia" <shop@example.com>',
  to:'customer@example.com', replyTo:'shop@example.com',
  subject:'Order confirmation', text:'Test order summary',
});
const message = JSON.parse(result.message);
assert.equal(message.to[0].address,'customer@example.com');
assert.equal(message.replyTo[0].address,'shop@example.com');
assert.equal(message.subject,'Order confirmation');
assert.equal(message.text,'Test order summary');
console.log('Mail import, transport and order-message composition passed; no email sent.');
