variable "public3_prefix" {
  default = "sv-public3"
}

resource "google_compute_firewall" "ssh-p2p" {
  name    = "ssh-p2p"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22", "30333"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["externalaccess"]
}

resource "google_compute_firewall" "vpn" {
  name    = "vpn"
  network = "default"

  allow {
    protocol = "udp"
    ports    = ["51820"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["externalaccess"]
}

resource "google_compute_instance" "main" {
  name         = "${var.public3_prefix}-${count.index}"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["externalaccess"]
  count        = var.node_count

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-1804-lts"
    }
  }

  network_interface {
    network = "default"

    access_config {
      # Ephemeral
    }
  }

  depends_on = ["google_compute_firewall.ssh-p2p", "google_compute_firewall.vpn"]

  service_account {
    scopes = ["compute-ro"]
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${var.public_key}"
  }
}
