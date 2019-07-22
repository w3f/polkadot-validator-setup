resource "packet_ssh_key" "key1" {
  name       = "terraform-1"
  public_key = var.public_key
}

resource "packet_device" "validator" {
  hostname         = "validator"
  plan             = var.machine_type
  facilities       = [var.location]
  operating_system = var.operating_system
  billing_cycle    = "hourly"
  project_id       = var.project_id
  depends_on       = ["packet_ssh_key.key1"]
}
