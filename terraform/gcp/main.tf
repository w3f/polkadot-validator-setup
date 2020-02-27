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

resource "google_compute_disk" "main-disk-{{ name }}" {
  name  = "${var.name}"
  type  = "pd-ssd"
  zone  = var.zone
  size  = 200
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
      size  = 100
    }
  }

  network_interface {
    network = "${var.network}"
    subnetwork = "${var.subnetwork}"
    network_ip = "${var.network_ip}"

    access_config {
      # Ephemeral
    }
  }

  depends_on = ["google_compute_firewall.p2p-{{ name }}", "google_compute_disk.main-disk-{{ name }}"]

  lifecycle {
    ignore_changes = ["attached_disk"]
  }

  service_account {
    scopes = ["compute-ro"]
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${var.public_key}"
  }
}

resource "google_compute_attached_disk" "main-pub-attached-{{ name }}" {
  count       = var.is_public ? 1 : 0
  disk        = google_compute_disk.main-disk-{{ name }}.self_link
  instance    = google_compute_instance.main-pub-{{ name }}[count.index].self_link
  device_name = "sdb"

  depends_on = ["google_compute_instance.main-pub-{{ name }}", "google_compute_disk.main-disk-{{ name }}"]
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
      size  = 100
    }
  }

  network_interface {
    network = "${var.network}"
    subnetwork = "${var.subnetwork}"
    network_ip = "${var.network_ip}"
  }

  depends_on = ["google_compute_firewall.p2p-{{ name }}", "google_compute_disk.main-disk-{{ name }}"]

  lifecycle {
    ignore_changes = ["attached_disk"]
  }

  service_account {
    scopes = ["compute-ro"]
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${var.public_key}"
  }
}

resource "google_compute_attached_disk" "main-attached-{{ name }}" {
  count       = var.is_public ? 0 : 1
  disk        = google_compute_disk.main-disk-{{ name }}.self_link
  instance    = google_compute_instance.main-{{ name }}[count.index].self_link
  device_name = "sdb"

  depends_on = ["google_compute_instance.main-{{ name }}", "google_compute_disk.main-disk-{{ name }}"]
}

