import Network from './network';
import RcvTransfer from './rcvTransfer';
import BaseTransfer from './base/baseTransfer';

const STATE_WAITING_CALL_0 = 'state_waiting_call_0';
const STATE_WAITING_CALL_1 = 'state_waiting_call_1';
const STATE_WAITING_ACK_0 = 'state_waiting_ack_0';
const STATE_WAITING_ACK_1 = 'state_waiting_ack_1';

const EVENT_TIME_OUT = 'event_time_out';

export default class SndTransfer extends BaseTransfer {
  constructor() {
    super();

    this._currentState = STATE_WAITING_CALL_0;
    this._cachedData = null;

    // 往返超时
    this._timeout = 150;
    this._timer = null;
  }

  static _instance = null;

  static getInstance() {
    if (!this._instance) {
      this._instance = new SndTransfer();
    }
    return this._instance;
  }

  _handleEvent(event) {
    switch (event) {
      case EVENT_TIME_OUT: {
        console.log('EVENT_TIME_OUT');
        this._clear_timer();

        switch (this._currentState) {
          case STATE_WAITING_ACK_0: {
            this._sendDataToRcv(this._cachedData, 0);
            break;
          }
          case STATE_WAITING_ACK_1: {
            this._sendDataToRcv(this._cachedData, 1);
            break;
          }
        }

        break;
      }
    }
  }

  /**
   * @public
   */
  rdt_send(data) {
    console.log('snd 准备发送 data: ', data);
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
    const { receiver, ...rest } = packet;
    console.log(`! snd 接收到 pkt, `, rest);

    if (
      this._currentState === STATE_WAITING_ACK_0 ||
      this._currentState === STATE_WAITING_ACK_1
    ) {

      if (this._isCorrupt(packet)) {
        console.error('snd 接收到受损的 pkt, 等待 timeout.');
      } else {

        switch (this._currentState) {
          case STATE_WAITING_ACK_0: {
            if (this._extract_seq_num(packet) === 0) {
              this._clear_timer();
              this._switchState(STATE_WAITING_CALL_1);
            }
            break;
          }
          case STATE_WAITING_ACK_1: {
            if (this._extract_seq_num(packet) === 1) {
              this._clear_timer();
              this._switchState(STATE_WAITING_CALL_0);
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

  _sendDataToRcv(data, seq) {
    const pkt = this._make_pkt(data, RcvTransfer.getInstance(), seq);
    console.log('snd 发送 pkt, data: ', data, 'seq: ', seq);
    Promise.resolve().then(() => {
      this._set_up_timer();
      Network.udt_send(pkt);
    });

  }

  _extract_seq_num(pkt) {
    return pkt && pkt.seqNum;
  }

  _set_up_timer() {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    console.log('set up timer');
    this._timer = setTimeout(() => {
      console.error('触发超时');
      this._handleEvent(EVENT_TIME_OUT);
    }, this._timeout);

  }

  _clear_timer() {
    console.log('清除 timer');
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

}

