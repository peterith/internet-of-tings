const express = require('express')
const mongoose = require('mongoose')
const mqtt = require('mqtt')
const path = require('path')

const app = express()
const port = 3000

const client = mqtt.connect('mqtt://test.mosquitto.org')
var topic = 'IC.embedded/internet_of_tings/test'

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connection is open to database'));

const measurementSchema = new mongoose.Schema({
  date: Date,
  red: Number,
  orange: Number,
  yellow: Number,
  green: Number,
  blue: Number,
  violet: Number,
});

const Measurement = mongoose.model('Measurement', measurementSchema);

client.on('connect', () => {
  client.subscribe(topic)
  console.log('Client has subscribed successfully to topic ' + topic);
})

client.on('message', (topic, message) => {
  var json = JSON.parse(message)

  var measurement = new Measurement(json)
  console.log(measurement)

  measurement.save((err, measurement) => {
  if (err) return console.error(err);
  console.log(measurement._id + ' saved to database')
  });
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
  Measurement.findOne({date: new Date('2012-04-23T18:25:43.511Z')}, (err, measurement) => {
    console.log(measurement.date)
  })
})

app.get('/data', (req, res) => {
  Measurement.findOne({date: new Date(req.query.date)}, (err, measurement) => {
    console.log(measurement.date)
    res.send(measurement)
  })
})

app.listen(port, () => console.log('Listening on port ' + port))
