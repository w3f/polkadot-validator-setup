resource "google_compute_firewall" "p2p-{{ name }}" {
  name    = "p2p-{{ name }}"
  network = "${var.network}"

  allow {
    protocol = "tcp"
    ports    = ["30333"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["{{ name }}"]
}

resource "google_compute_instance" "main-pub-{{ name }}" {
  name         = "${var.name}-${count.index}"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["{{ name }}"]
  count        = var.is_public ? 1 : 0

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-1804-lts"
      size  = 400
    }
  }

  network_interface {
    network = "${var.network}"
    subnetwork = "${var.subnetwork}"

    access_config {
      # Ephemeral
    }
  }

  depends_on = ["google_compute_firewall.p2p-{{ name }}"]

  service_account {
    scopes = ["compute-ro"]
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${var.public_key}"
  }
}

resource "google_compute_instance" "main-{{ name }}" {
  name         = "${var.name}-${count.index}"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["{{ name }}"]
  count        = var.is_public ? 0 : 1

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-1804-lts"
      size  = 400
    }
  }

  network_interface {
    network = "${var.network}"
    subnetwork = "${var.subnetwork}"
  }

  depends_on = ["google_compute_firewall.p2p-{{ name }}"]

  service_account {
    scopes = ["compute-ro"]
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${var.public_key}"
  }
}
