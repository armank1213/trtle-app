const express = require('express');
const mqtt = require('mqtt');

const app = express();
const port = Number(process.env.PORT || 8000);
const mqttBrokerAddress = process.env.MQTT_BROKER_ADDRESS || '192.168.68.90';
const mqttChannel = process.env.MQTT_CHANNEL || 'PumpControl';

app.use(express.json());

const publishMqttMessage = (message) =>
  new Promise((resolve, reject) => {
    const client = mqtt.connect(`mqtt://${mqttBrokerAddress}`);

    client.on('connect', () => {
      client.publish(mqttChannel, message, { qos: 0 }, (error) => {
        client.end();

        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    client.on('error', (error) => {
      client.end();
      reject(error);
    });
  });

app.post('/api/control/spray', async (_req, res) => {
  try {
    await publishMqttMessage('ON');
    res.status(200).json({
      success: true,
      action: 'spray',
      mqttChannel,
      message: 'ON',
    });
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Failed to publish MQTT message');
  }
});

app.post('/api/control/water', async (_req, res) => {
  try {
    await publishMqttMessage('water');
    res.status(200).json({
      success: true,
      action: 'water',
      mqttChannel,
      message: 'water',
    });
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Failed to publish MQTT message');
  }
});

app.listen(port, () => {
  console.log(`Control backend running on http://localhost:${port}`);
});
