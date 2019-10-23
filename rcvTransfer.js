import BaseTransfer from './base/baseTransfer';
import SndTransfer from './sndTransfer';
import Network from './network';

const STATE_WAITING_CALL_0 = 'state_waiting_call_0';
const STATE_WAITING_CALL_1 = 'state_waiting_call_1';

export default class RcvTransfer extends BaseTransfer{

  constructor() {
    super();

    this._currentState = STATE_WAITING_CALL_0;
  }

  static _instance = null;

  static getInstance() {
    if (!this._instance) {
      this._instance = new RcvTransfer();
    }
    return this._instance;
  }

  rdt_rcv(packet) {
    this._console(packet, 26);
    let sndPkt = null;

    if (this._isCorrupt(packet)) {

      // 接收到的 pkt 受损
      switch (this._currentState) {
        case STATE_WAITING_CALL_0:
          sndPkt = this._make_ack_pkt(SndTransfer.getInstance(), 1);
          break;
        case STATE_WAITING_CALL_1:
          sndPkt = this._make_ack_pkt(SndTransfer.getInstance(), 0);
          break;
      }

    } else {

      switch (this._currentState) {
        case STATE_WAITING_CALL_0: {

          switch (this._extract_seq_num(packet)) {
            case 0:
              sndPkt = this._make_ack_pkt(SndTransfer.getInstance(), 0);
              this._extract_deliver(packet);
              this._switchState(STATE_WAITING_CALL_1);
              break;
            case 1:
              sndPkt = this._make_ack_pkt(SndTransfer.getInstance(), 1);
              break;
          }

          break;
        }
        case STATE_WAITING_CALL_1: {

          switch (this._extract_seq_num(packet)) {
            case 0:
              sndPkt = this._make_ack_pkt(SndTransfer.getInstance(), 0);
              break;
            case 1:
              sndPkt = this._make_ack_pkt(SndTransfer.getInstance(), 1);
              this._extract_deliver(packet);
              this._switchState(STATE_WAITING_CALL_0);
              break;
          }

          break;
        }
      }

    }

    Promise.resolve().then(() => {
      Network.udt_send(sndPkt);
    });

  }

  /**
   * @private
   */
  _switchState(state) {
    this._currentState = state;
  }

  _deliver_data(data) {
    console.log(`rcv ${(new Date()).toString().substring(16, 24)} ${JSON.stringify(data)}`);
  }

  _extract_seq_num(pkt) {
    return pkt && pkt.seqNum;
  }

  _extract_deliver(packet) {
    const d = this._extract(packet);
    this._deliver_data(d);
  }

  _console(pkt, line) {
    const { receiver, ...rest } = pkt;
    console.log(`rcvTransfer: ${line} -> `, rest);
  }

}