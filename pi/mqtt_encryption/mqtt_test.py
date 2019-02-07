import paho.mqtt.client as mqtt

client = mqtt.Client()

client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt", keyfile="client.key")

code = client.connect("test.mosquitto.org", port=8884)

print("Connection code:", code)

code = client.publish("IC.embedded/internet_of_tings/test", "hello")

print("Publish code: ", code)
