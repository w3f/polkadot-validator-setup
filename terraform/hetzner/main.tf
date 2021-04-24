resource "hcloud_server" "validator" {
  server_type = var.server_type
  image = var.image
  name = "validator-${count.index}"
  count = var.node_count
  location = var.location
  ssh_keys = [var.public_key_name]
  user_data = templatefile("setup_users.sh", { user = "ansible", public_key = var.public_key, password_hash = var.password_hash })
}
