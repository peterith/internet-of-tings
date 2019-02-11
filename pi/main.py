import time
import os
import sys
import as7262
import smbus
import paho.mqtt.client as mqtt
import json
import datetime
import RPi.GPIO as GPIO

########## Motor Setup

servoPin = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPin, GPIO.OUT)
p = GPIO.PWM(servoPin, 50)

########## MQTT Setup

client = mqtt.Client()
client.tls_set(ca_certs="mqtt_encryption/mosquitto.org.crt", certfile="mqtt_encryption/client.crt", keyfile="mqtt_encryption/client.key")
client.connect("test.mosquitto.org", port=8884)
client.subscribe("IC.embedded/internet_of_tings/water")

def on_message(client, userdata, msg):
    print("Water now!")
    p.start(2.5)
    for i in range(5): 
        p.ChangeDutyCycle(10)
        time.sleep(0.5)
        p.ChangeDutyCycle(5)
        time.sleep(0.5)
        p.ChangeDutyCycle(0)

client.on_message = on_message
client.loop_start()

######### Spectral Sensor Setup

as7262.soft_reset()
as7262.set_gain(64)
as7262.set_integration_time(17.857)
as7262.set_measurement_mode(2)
as7262.set_illumination_led(1)

########## Humidity Sensor Setup

SI7021_BUS_ADDR = 0x40
HUMIDITY_INST = 0xF5
TEMP_INST = 0xF3

bus = smbus.SMBus(1)

########## Main Loop

try:
    while True:
        
        ########## Retrieving humidity and temperature data
        bus.write_byte(SI7021_BUS_ADDR, HUMIDITY_INST)

        time.sleep(0.3)

        data0 = bus.read_byte(SI7021_BUS_ADDR)
        data1 = bus.read_byte(SI7021_BUS_ADDR)

        humidity = ((data0 * 256 + data1) * 125 / 65536.0) - 6

        time.sleep(0.3)

        bus.write_byte(SI7021_BUS_ADDR, TEMP_INST)

        time.sleep(0.3)

        data0 = bus.read_byte(SI7021_BUS_ADDR)
        data1 = bus.read_byte(SI7021_BUS_ADDR)

        temperature = ((data0 * 256 + data1) * 175.72 / 65536.0) - 46.85
        
        ######## Retrieving spectral data
        values = as7262.get_calibrated_values()

        ######## Publishing data to MQTT broker
        message = json.dumps({"date": datetime.datetime.now().strftime("%Y%m%d%H%M%S"),
        "red": values.red,
        "orange": values.orange,
        "yellow": values.yellow,
        "green": values.green,
        "blue": values.blue,
        "violet": values.violet,
        "humidity": humidity,
        "temperature": temperature})

        print('message', message)
        
        client.publish("IC.embedded/internet_of_tings/measurement", message)
        
        ######## Automatically water plant using spectral data
        if values.orange > 1000:
            client.publish("IC.embedded/internet_of_tings/water", "Water now!")

        time.sleep(10)

except KeyboardInterrupt:
    as7262.set_measurement_mode(3)
    as7262.set_illumination_led(0)
    p.stop()
    GPIO.cleanup()
