resource "packet_device" "validator" {
  hostname         = "validator"
  plan             = var.machine_type
  facilities       = [var.location]
  operating_system = var.operating_system
  billing_cycle    = "hourly"
  project_id       = var.project_id
  ip_address_types = ["private_ipv4"]
}
