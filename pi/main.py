import time
import os
import sys
import as7262
import smbus

MAX_VALUE = 14000.0
BAR_WIDTH = 25

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
        print('values:', values.red, values.orange, values.yellow, values.green, values.blue, values.violet)
        values = [int(x/y*MAX_VALUE) for x,y in zip(list(values), list(baseline))]
        print('values_adjusted:', values)
        values = [int(min(value, MAX_VALUE) / MAX_VALUE * BAR_WIDTH) for value in values]
        print('bar', values)
        print('humidity', humidity)
        print('temperature', temperature)
        sys.stdout.flush()
        time.sleep(0.5)

except KeyboardInterrupt:
    as7262.set_measurement_mode(3)
    as7262.set_illumination_led(0)
