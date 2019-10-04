output "ip_address" {
  value = "${google_compute_instance.main-{{ name }}.*.network_interface.0.access_config.0.nat_ip}"
}
