import Network from './network';

const STATE_WAITING_CALL = 'state_waiting_call';

export default class SndTransfer {

  /**
   * @public
   */
  static rdt_send(data) {
    const packet = this._make_pkt(data);
    Network.udt_send(packet);
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
  static _make_pkt(data) {
    return data;
  }

}

