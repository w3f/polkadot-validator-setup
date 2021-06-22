resource "hcloud_server" "validator" {
  server_type = var.server_type
  image       = var.image
  name        = "${var.name}-${count.index}"
  count       = var.node_count
  location    = var.location
  ssh_keys    = [hcloud_ssh_key.default.id]
  user_data   = templatefile("setup_users.sh", { user = var.ssh_user, public_key = var.public_key, password_hash = var.password_hash })
}

resource "hcloud_ssh_key" "default" {
  name       = var.public_key_name
  public_key = var.public_key
}
