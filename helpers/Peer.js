module.exports = class Peer {
  constructor(socket_id, userId) {
    this.id = socket_id;
    this.userId = userId;
    this.transports = new Map();
    this.consumers = new Map();
    this.producers = new Map();
  }

  addTransport(transport) {
    this.transports.set(transport.id, transport);
  }

  async connectTransport(transport_id, dtlsParameters) {
    if (!this.transports.has(transport_id)) return;

    await this.transports.get(transport_id).connect({
      dtlsParameters: dtlsParameters,
    });
  }

  async createProducer(producerTransportId, rtpParameters, kind, isScreenShare) {
    console.log('kind', kind);
    let producer = await this.transports.get(producerTransportId).produce({
      kind,
      rtpParameters,
      appData: { isScreenShare },
    });

    this.producers.set(producer.id, producer);

    producer.on('transportclose', function () {
        console.log('Producer transport close', {
          name: `${this.userId}`,
          consumer_id: `${producer.id}`,
        });
        producer.close();
        this.producers.delete(producer.id);
      }.bind(this)
    );

    return producer;
  }

  async createConsumer(consumer_transport_id, producer_id, rtpCapabilities) {
    let consumerTransport = this.transports.get(consumer_transport_id);

    let consumer = null;

    try {
      consumer = await consumerTransport.consume({
        producerId: producer_id,
        rtpCapabilities,
        paused: false, //producer.kind === 'video',
      });
    } catch (error) {
      console.error('Consume failed', error);
      return;
    }

    if (consumer.type === 'simulcast') {
      await consumer.setPreferredLayers({
        spatialLayer: 2,
        temporalLayer: 2,
      });
    }

    this.consumers.set(consumer.id, consumer);

    consumer.on('transportclose', function () {
        console.log('Consumer transport close', {
          name: `${this.userId}`,
          consumer_id: `${consumer.id}`,
        });
        this.consumers.delete(consumer.id);
      }.bind(this)
    );

    return {
      consumer,
      params: {
        producerId: producer_id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      },
    };
  }

  closeProducer(producer_id) {
    try {
      this.producers.get(producer_id).close();
    } catch (e) {
      console.warn(e);
    }

    this.producers.delete(producer_id);
  }

  close() {
    this.transports.forEach((transport) => transport.close());
  }

  removeConsumer(consumer_id) {
    this.consumers.delete(consumer_id);
  }
};
