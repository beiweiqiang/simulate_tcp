import Network from './network';
import RcvTransfer from './rcvTransfer';
import BaseTransfer from './base/baseTransfer';

const STATE_WAITING_CALL = 'state_waiting_call';
const STATE_WAITING_ACK_NAK = 'state_waiting_ack_nak';

export default class SndTransfer extends BaseTransfer {
  constructor() {
    super();

    this._currentState = STATE_WAITING_CALL;
  }

  static _instance = null;

  static getInstance() {
    if (!this._instance) {
      this._instance = new SndTransfer();
    }
    return this._instance;
  }

  /**
   * @public
   */
  rdt_send(data) {
    console.log('snd send data: ', data);

    if (this._currentState === STATE_WAITING_CALL) {
      const packet = this._make_pkt(data, RcvTransfer.getInstance());

      Promise.resolve().then(() => {
        Network.udt_send(packet);
      });

      this._switchState(STATE_WAITING_ACK_NAK);
    } else {
      console.error('snd transfer, in busy');
    }

  }

  rdt_rcv(packet) {
    if (this._currentState === STATE_WAITING_ACK_NAK) {

      if (this._isCorrupt(packet)) {
        console.error('snd receive pkt: corrupt');

      } else {
        if (this._isAck(packet)) {
          console.log('snd isAck');
          // const d = this._extract(packet);
          // this._deliver_data(d);

        } else if (this._isNak(packet)) {
          console.error('snd isNak');

        } else {
          console.error('snd receive pkt: no ack/nak');
        }

      }

      this._switchState(STATE_WAITING_CALL);

    }
  }

  /**
   * @private
   */
  _switchState(state) {
    this._currentState = state;
  }

  _deliver_data(data) {
    console.log(`snd ${(new Date()).toString().substring(16, 24)} ${JSON.stringify(data)}`);
  }

}

