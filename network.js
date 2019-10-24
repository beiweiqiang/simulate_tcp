
export default class Network {

  static udt_send(packet) {
    const { receiver } = packet;

    const pkt = Object.assign(packet, {
      corrupt: Math.random() > 0.8,
    });

    if (pkt.corrupt) {
      console.error('network: pkt corrupt');
    }

    if (Math.random() > 0.8) {
      Promise.resolve().then(() => {
        receiver.rdt_rcv(pkt);
      });
    } else {
      console.error('network: 抛弃 pkt');
    }
  }
}