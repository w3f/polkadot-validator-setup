output "ip_address" {
  value = hcloud_server.validator.*.ipv4_address
}

output "ip_address_prometheus" {
  value = hcloud_server.prometheus.*.ipv4_address
}
