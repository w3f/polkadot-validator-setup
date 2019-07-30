resource "packet_ssh_key" "key1" {
  name       = "terraform-1"
  public_key = var.validator_public_key
}

resource "packet_device" "validator" {
  hostname         = "validator"
  plan             = var.packet_machine_type
  facilities       = [var.packet_location]
  operating_system = var.packet_operating_system
  billing_cycle    = "hourly"
  project_id       = var.packet_project_id
  depends_on       = ["packet_ssh_key.key1"]
}
