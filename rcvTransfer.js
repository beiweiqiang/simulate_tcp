import BaseTransfer from './base/baseTransfer';
import SndTransfer from './sndTransfer';
import Network from "./network";

const STATE_WAITING_CALL = 'state_waiting_call';

export default class RcvTransfer extends BaseTransfer{

  constructor() {
    super();

    this._currentState = STATE_WAITING_CALL;
  }

  static _instance = null;

  static getInstance() {
    if (!this._instance) {
      this._instance = new RcvTransfer();
    }
    return this._instance;
  }

  rdt_rcv(packet) {
    let sndPkt = null;

    if (this._isCorrupt(packet)) {
      sndPkt = this._make_nak_pkt(SndTransfer.getInstance());
    } else {
      sndPkt = this._make_ack_pkt(SndTransfer.getInstance());

      const d = this._extract(packet);
      this._deliver_data(d);
    }

    Promise.resolve().then(() => {
      Network.udt_send(sndPkt);
    });

    this._switchState(STATE_WAITING_CALL);

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

}