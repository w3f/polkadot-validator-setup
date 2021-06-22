output "ip_address" {
  value = hcloud_server.validator.*.ipv4_address
}
