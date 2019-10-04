resource "google_compute_firewall" "ssh-p2p-{{ name }}" {
  name    = "ssh-p2p-{{ name }}"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22", "30333"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["{{ name }}"]
}

resource "google_compute_firewall" "vpn-{{ name }}" {
  name    = "vpn-{{ name }}"
  network = "default"

  allow {
    protocol = "udp"
    ports    = ["51820"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["{{ name }}"]
}

resource "google_compute_instance" "main-{{ name }}" {
  name         = "${var.name}-${count.index}"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["{{ name }}"]
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

  depends_on = ["google_compute_firewall.ssh-p2p-{{ name }}", "google_compute_firewall.vpn-{{ name }}"]

  service_account {
    scopes = ["compute-ro"]
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${var.public_key}"
  }
}
