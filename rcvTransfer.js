
const STATE_WAITING_CALL = 'state_waiting_call';

export default class RcvTransfer {

  static rdt_rcv(packet) {
    const d = this._extract(packet);
    this._deliver_data(d);
    this._switchState(STATE_WAITING_CALL);
  }

  /**
   * @private
   */
  static _currentState = STATE_WAITING_CALL;

  /**
   * @private
   */
  static _switchState(state) {
    this._currentState = state;
  }

  /**
   * @private
   */
  static _extract(packet) {
    return packet;
  }

  /**
   * @private
   */
  static _deliver_data(data) {
    console.log((new Date()).toString() +
      ' rcvTransfer.js: 27 -> _deliver_data -> ', data);
  }
}