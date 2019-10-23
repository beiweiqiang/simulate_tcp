/**
 * { data, receiver, nak, ack }
 */

export default class BaseTransfer {
  constructor() {

    this._currentState = '';
  }


  rdt_rcv(pkt) {}

  rdt_send(data) {}

  _make_pkt(data, receiver) {
    return {
      data,
      receiver,
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

  _make_nak_pkt(receiver) {
    return {
      nak: true,
      receiver,
    };
  }

  _make_ack_pkt(receiver) {
    return {
      ack: true,
      receiver,
    };
  }

}