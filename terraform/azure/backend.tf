provider "google" {
  project     = var.state_project
  version     = "~>2.15"
}

terraform {
  backend "gcs" {
    bucket  = "sv-tf-state"
    prefix  = "azure"
  }
}
