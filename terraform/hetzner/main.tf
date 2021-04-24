resource "hcloud_server" "validator" {
  server_type = var.server_type
  image = var.image
  name = "validator-${count.index}"
  count = var.node_count
  location = var.location
  ssh_keys = [var.public_key_name]
  user_data = templatefile("setup_users.sh", { user = "ansible", public_key = var.public_key_validator, password = var.password })
}

resource "hcloud_server" "prometheus" {
  server_type = var.server_type_monitoring
  image = var.image
  name = "prometheus"
  count = 1
  location = var.location
  ssh_keys = [var.public_key_name]
  user_data = templatefile("setup_users.sh", { user = "ansible", public_key = var.public_key_prometheus, password = var.password })
}
# TODO add a hetzner network
