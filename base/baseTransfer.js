/**
 * packet
 * { data, receiver, nak, ack, seqNum }
 */

export default class BaseTransfer {
  constructor() {

    this._currentState = '';
  }


  rdt_rcv(pkt) {}

  rdt_send(data) {}

  _make_pkt(data, receiver, seqNum) {
    return {
      data,
      receiver,
      seqNum,
    };
  }

  _extract(pkt) {
    return pkt && pkt.data || null;
  }

  _isCorrupt(pkt) {
    const { corrupt } = pkt;
    return !!corrupt;
  }

  _isNak(pkt) {
    const { nak } = pkt;
    return !!nak;
  }

  _isAck(pkt) {
    const { ack } = pkt;
    return !!ack;
  }

  _make_nak_pkt(receiver, seqNum) {
    return {
      nak: true,
      receiver,
      seqNum,
    };
  }

  _make_ack_pkt(receiver, seqNum) {
    return {
      ack: true,
      receiver,
      seqNum,
    };
  }

}