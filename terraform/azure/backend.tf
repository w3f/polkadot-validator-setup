provider "google" {
  project     = var.state_project
}

terraform {
  backend "gcs" {
    bucket  = "sv-tf-state"
    prefix  = "azure"
  }
}
