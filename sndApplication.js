import SndTransfer from './sndTransfer';

SndTransfer.rdt_send({ a: 1 });
SndTransfer.rdt_send({ a: 2 });

setTimeout(() => {
  SndTransfer.rdt_send({ a: 3 });
}, 1000);

setTimeout(() => {
  SndTransfer.rdt_send({ a: 4 });
}, 2000);
