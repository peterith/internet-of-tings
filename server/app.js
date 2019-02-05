const express = require('express')
const mongoose = require('mongoose')
const mqtt = require('mqtt')

const app = express()
const port = 3000

const client = mqtt.connect('mqtt://test.mosquitto.org')
var topic = 'IC.embedded/internet_of_tings/test'

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connection open to database!'));

const measurementSchema = new mongoose.Schema({
  date: Date,
  red: Number,
  blue: Number,
  yellow: Number,
  green: Number,
  violet: Number,
  orange: Number
});

const Measurement = mongoose.model('Measurement', measurementSchema);

client.on('connect', () => {
  client.subscribe(topic)
  console.log('client has subscribed successfully to topic ' + topic);
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

//app.use(express.static('public'))
app.get('/', (req, res) => {
  res.send('Hello World!')
  Measurement.findOne({date: new Date('2012-04-23T18:25:43.511Z')}, (err, measurement) => {
    console.log(measurement.date)
  })
})

app.listen(port, () => console.log('Example app listening on port '+ port))
