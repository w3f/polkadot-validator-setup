data "digitalocean_project" "default" {
  name = var.project_id
}

resource "digitalocean_droplet" "default" {
  image = var.image
  name = "{{name}}-${count.index}"
  region = var.location
  size = var.machine_type
  ssh_keys = [digitalocean_ssh_key.default.fingerprint]
  count = var.node_count
}

resource "digitalocean_ssh_key" "default" {
  name = "Polkadot-{{ name }}"
  public_key = var.public_key
}

resource "digitalocean_project_resources" "droplet-in-project" {
  project = data.digitalocean_project.default.id
  resources = digitalocean_droplet.default.*.urn
}
