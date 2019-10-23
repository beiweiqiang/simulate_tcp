import Network from './network';
import RcvTransfer from './rcvTransfer';
import BaseTransfer from './base/baseTransfer';

const STATE_WAITING_CALL_0 = 'state_waiting_call_0';
const STATE_WAITING_CALL_1 = 'state_waiting_call_1';
const STATE_WAITING_ACK_0 = 'state_waiting_ack_0';
const STATE_WAITING_ACK_1 = 'state_waiting_ack_1';

export default class SndTransfer extends BaseTransfer {
  constructor() {
    super();

    this._currentState = STATE_WAITING_CALL_0;
    this._cachedData = null;
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
    this._cachedData = data;

    switch (this._currentState) {
      case STATE_WAITING_CALL_0: {
        this._sendDataToRcv(data, 0);
        this._switchState(STATE_WAITING_ACK_0);
        break;
      }
      case STATE_WAITING_CALL_1: {
        this._sendDataToRcv(data, 1);
        this._switchState(STATE_WAITING_ACK_1);
        break;
      }
      default:
        console.error('snd is waiting for ack/nak');
        break;
    }

    console.log('current state: ', this._currentState);

  }

  rdt_rcv(packet) {
    this._console(packet, 55);

    if (
      this._currentState === STATE_WAITING_ACK_0 ||
      this._currentState === STATE_WAITING_ACK_1
    ) {

      if (this._isCorrupt(packet)) {
        console.error('snd receive pkt: corrupt');
        // 如果受损了, 重新发一次
        switch (this._currentState) {
          case STATE_WAITING_ACK_0:
            console.log('重发, data: ', this._cachedData, 'seq: ', 0);
            this._sendDataToRcv(this._cachedData, 0);
            break;
          case STATE_WAITING_ACK_1:
            console.log('重发, data: ', this._cachedData, 'seq: ', 1);
            this._sendDataToRcv(this._cachedData, 1);
            break;
        }

      } else {

        switch (this._currentState) {
          case STATE_WAITING_ACK_0: {

            switch (this._extract_seq_num(packet)) {
              case 0:
                this._switchState(STATE_WAITING_CALL_1);
                break;
              case 1:
                console.log('重发, data: ', this._cachedData, 'seq: ', 0);
                this._sendDataToRcv(this._cachedData, 0);
                break;
            }

            break;
          }
          case STATE_WAITING_ACK_1: {

            switch (this._extract_seq_num(packet)) {
              case 0:
                console.log('重发, data: ', this._cachedData, 'seq: ', 1);
                this._sendDataToRcv(this._cachedData, 1);
                break;
              case 1:
                this._switchState(STATE_WAITING_CALL_0);
                break;
            }

            break;
          }
        }
      }

    } else {
      // 处在不能接收 pkt 的状态
      console.error('snd state cannot receive pkt: ', this._currentState);
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

  _sendDataToRcv(data, seq) {
    const pkt = this._make_pkt(data, RcvTransfer.getInstance(), seq);
    Promise.resolve().then(() => {
      Network.udt_send(pkt);
    });
  }

  _console(pkt, line) {
    const { receiver, ...rest } = pkt;
    console.log(`sndTransfer: ${line} -> `, rest);
  }

  _extract_seq_num(pkt) {
    return pkt && pkt.seqNum;
  }

}

