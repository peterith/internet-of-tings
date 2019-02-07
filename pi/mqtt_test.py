import paho.mqtt.client as mqtt

client = mqtt.Client()

client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt", keyfile="client.key")

code = client.connect("test.mosquitoo.org", port=8884)

print("Connection code:", code)

code = client.publish("IC.embedded/Internet_of_Tings/test", "hello")

print("Publish code: ", code)
