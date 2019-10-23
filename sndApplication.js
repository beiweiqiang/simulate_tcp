import SndTransfer from './sndTransfer';

SndTransfer.getInstance().rdt_send({ a: 1 });

setTimeout(() => {
  SndTransfer.getInstance().rdt_send({ a: 2 });
}, 500);

setTimeout(() => {
  SndTransfer.getInstance().rdt_send({ a: 3 });
}, 1000);

setTimeout(() => {
  SndTransfer.getInstance().rdt_send({ a: 4 });
}, 2000);
