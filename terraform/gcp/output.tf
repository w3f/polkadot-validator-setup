output "ip_address" {
  value = "${ var.is_public ? google_compute_instance.main-pub-{{ name }}.*.network_interface.0.network_ip : google_compute_instance.main-{{ name }}.*.network_interface.0.network_ip }"
}
