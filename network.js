import RcvTransfer from './rcvTransfer';

export default class Network {

  static udt_send(packet) {
    RcvTransfer.rdt_rcv(packet);
  }
}