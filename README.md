# Internet of Tings

This repository contains a multi-purpose monitoring system for the agricultural and floral industries. It contains a Raspberry Pi which tracks the freshness of the plants through the [AS7262](https://www.adafruit.com/product/3779) spectral sensor, and the environment of the plants through the [SI7021](https://www.adafruit.com/product/3251) humidity and temperature sensor. The Raspberry Pi is integrated with an automatic watering system; a sprinkler is activated when the data suggests that the plants require watering. The Raspberry Pi communicates with a NodeJS server via a MQTT broker to store the data on a MongoDB cloud database. The server hosts a user interface for real-time visualisation of data from Raspberry Pi and allows the user to manually water plants remotely from anywhere.

## Getting Started

Clone the repository into your local directory to get the source code.

### Prerequisites

You will need a [Raspberry Pi](https://www.raspberrypi.org) with [Python 3](https://www.python.org) installed.
You will also need [Node Package Manager](https://www.npmjs.com) installed on your computer.

### Installing

Install the necessary packages on the Raspberry Pi:
```
sudo apt-get install python3-pip python3-smbus python3-gpiozero
pip3 install paho-mqtt
```

Install the necessary packages for the server:

```
npm install express mongoose mqtt
```

## Deployment

From the root folder, access the server folder and run the NodeJS server:
```
cd server
node app.js
```

On the Raspberry Pi, access the pi folder and run the python module:
```
cd pi
python3 main.py
```

## Built With

* [NodeJS](https://nodejs.org) - The server platform used
* [ExpressJS](https://expressjs.com) - The web framework used
* [ChartJS](https://www.chartjs.org) - The chart framework used

## Contributing

As the project is part of the Embedded Systems module at Imperial College London, we are not accepting any external pull requests.

## Authors

* **Peerapong Rithisith** - [github.com/peterith](https://github.com/peterith)
* **Olaf Sikorski** - [github.com/os1315](https://github.com/os1315)
* **Robert Tan** - [github.com/tanyuzhuo](https://github.com/tanyuzhuo)
* **Che Zhang** - [github.com/cz3015](https://github.com/cz3015)

## Acknowledgments

* To all of you for visiting my GitHub page
* [as7262-python](https://github.com/pimoroni/as7262-python) for the AS7262 spectral sensor Python library
* [Eclipse Mosquitto](https://mosquitto.org) for the message broker
* [Dr Edward Stott](https://www.imperial.ac.uk/people/ed.stott) for providing us with the knowledge and equipments
