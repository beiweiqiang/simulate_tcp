import SndTransfer from './sndTransfer';

/*
* 自测: 在 rcv 可能收到冗余的 data, 在 snd 收到正确的 seqNum 顺序
* */

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
