const express = require('express')
const mongoose = require('mongoose')
const mqtt = require('mqtt')
const path = require('path')

const app = express()
const port = 3000

const client = mqtt.connect('mqtt://test.mosquitto.org')
const measurementTopic = 'IC.embedded/internet_of_tings/measurement'
const waterTopic = 'IC.embedded/internet_of_tings/water'

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connection is open to database'))

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
})

const Measurement = mongoose.model('Measurement', measurementSchema)

client.on('connect', () => {
  client.subscribe(measurementTopic)
  client.subscribe(waterTopic)
  console.log('Client has subscribed successfully to ' + measurementTopic)
  console.log('Client has subscribed successfully to ' + waterTopic)
})

client.on('message', (topic, message) => {
  if (topic === measurementTopic) {
    var json = JSON.parse(message)
    var measurement = new Measurement(json)
    console.log(measurement)

    measurement.save((err, measurement) => {
      if (err) {
        console.error(err)
      } else {
        console.log(measurement._id + ' saved to database')
      }
    })
  } else {
    console.log(message.toString())
  }
})

app.use(express.static('public'))

app.get('/measurement', (req, res) => {
  Measurement.findOne({date: req.query.date}, (err, measurement) => {
    if (err) {
      console.error(err)
      res.send(null)
    } else {
      console.log(measurement.date)
      res.send(measurement)
    }
  })
})

app.post('/water', (req, res) => {
  client.publish(waterTopic, 'Water now!')
  res.send(null)
})

app.listen(port, () => console.log('Listening on port ' + port))
