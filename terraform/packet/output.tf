output "ip_address" {
  value = "${packet_device.validator-{{ name }}.*.network.0.address}"
}
