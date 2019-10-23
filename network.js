
export default class Network {

  static udt_send(packet) {
    const { receiver } = packet;

    const pkt = Object.assign(packet, {
      corrupt: Math.random() > 0.8,
    });

    console.log('network corrupt: ', pkt.corrupt);

    receiver.rdt_rcv(pkt);
  }
}