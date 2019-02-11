const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const port = 3000;

const client = mqtt.connect('mqtt://test.mosquitto.org');
const measurementTopic = 'IC.embedded/internet_of_tings/measurement';
const waterTopic = 'IC.embedded/internet_of_tings/water';

// MondoDB Setup
mongoose.connect('mongodb://Olaf:sudosudo19@ds129625.mlab.com:29625/internet-of-tings', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', () => console.error('MongoDB connection error'));
db.once('open', () => console.log('MongoDB connection is open'));

const measurementSchema = new mongoose.Schema({
  date: Number,
  red: Number,
  orange: Number,
  yellow: Number,
  green: Number,
  blue: Number,
  violet: Number,
  humidity: Number,
  temperature: Number
});

const Measurement = mongoose.model('Measurement', measurementSchema);

// MQTT Setup
client.on('connect', () => {
  client.subscribe(measurementTopic);
  client.subscribe(waterTopic);
  console.log('Client has subscribed successfully to ' + measurementTopic);
  console.log('Client has subscribed successfully to ' + waterTopic);
});

client.on('message', (topic, message) => {
  if (topic === measurementTopic) {
    var json = JSON.parse(message);
    var measurement = new Measurement(json);
    console.log(measurement);

    measurement.save((err, measurement) => {
      if (err) {
        console.error(err);
      } else {
        console.log(measurement._id + ' saved to database');
      }
    });
  } else {
    console.log(message.toString());
  }
});

// homepage
app.use(express.static('public'));

// GET request for retrieving measurements
app.get('/measurement', (req, res) => {
  var timestamp = req.query.date * 1000000;
  Measurement.find().where('date').gt(timestamp).lt(timestamp + 1000000).exec((err, measurement) => {
    if (err) {
      console.error(err);
      res.send({});
    } else {
      console.log(measurement);
      res.send(measurement);
    }
  });
})

// POST request for watering plant
app.post('/water', (req, res) => {
  client.publish(waterTopic, 'Water now!');
  res.send(null);
})

// Listening forever
app.listen(port, () => console.log('Listening on port ' + port));
