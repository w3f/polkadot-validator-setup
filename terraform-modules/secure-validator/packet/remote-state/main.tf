provider "google" {
  project     = "polkadot-benchmarks"
}

resource "google_storage_bucket" "imagestore" {
  name          = "sv-tf-state"
  force_destroy = true
}
