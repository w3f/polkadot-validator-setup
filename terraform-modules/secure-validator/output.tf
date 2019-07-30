output "validator_ip_address" {
  value = "${packet_device.validator.network.0.address}"
}

output "public1_ip_address" {
  value = "${aws_instance.main.public_ip}"
}

output "public2_ip_address" {
  value = "${data.azurerm_public_ip.main.ip_address}"
}

output "public3_ip_address" {
  value = "${google_compute_instance.main.network_interface.0.access_config.0.nat_ip}"
}
