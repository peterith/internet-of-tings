import time
import os
import sys
import as7262
import smbus
import paho.mqtt.client as mqtt
import json
import datetime

MAX_VALUE = 14000.0
BAR_WIDTH = 25

##########

client = mqtt.Client()
client.tls_set(ca_certs="mqtt_encryption/mosquitto.org.crt", certfile="mqtt_encryption/client.crt", keyfile="mqtt_encryption/client.key")
client.connect("test.mosquitto.org", port=8884)

##########
as7262.soft_reset()
as7262.set_gain(64)
as7262.set_integration_time(17.857)
as7262.set_measurement_mode(2)
as7262.set_illumination_led(1)

##########

SI7021_BUS_ADDR = 0x40
HUMIDITY_INST = 0xF5
TEMP_INST = 0xF3

bus = smbus.SMBus(1)

##########

try:
    input = raw_input
except NameError:
    pass

##########

input("Setting white point baseline.\n\nHold a white sheet of paper ~5cm in front of the sensor and press a key...\n")
baseline = as7262.get_calibrated_values()
time.sleep(1)
input("Baseline set. Press a key to continue...\n")
sys.stdout.flush()

##########

try:
    while True:

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

        values = as7262.get_calibrated_values()
        sys.stdout.flush()

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
        
        client.publish("IC.embedded/internet_of_tings/test", message)
        time.sleep(5)

except KeyboardInterrupt:
    as7262.set_measurement_mode(3)
    as7262.set_illumination_led(0)
