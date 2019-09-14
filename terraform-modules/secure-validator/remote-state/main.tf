provider "google" {
  project     = var.state_project
}

resource "google_storage_bucket" "imagestore" {
  name          = "sv-tf-state"
  force_destroy = true
}
