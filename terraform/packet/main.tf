#resource "packet_ssh_key" "key-{{ name }}" {
#  name       = var.name
#  public_key = var.public_key
#}

resource "packet_device" "validator-{{ name }}" {
  hostname         = "{{name}}-${count.index}"
  plan             = var.machine_type
  facilities       = [var.location]
  operating_system = var.image
  billing_cycle    = "hourly"
  project_id       = var.project_id
#  depends_on       = ["packet_ssh_key.key-{{ name }}"]
  count            = var.node_count
}
