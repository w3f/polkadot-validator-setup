provider "google" {
  project     = "polkadot-benchmarks"
}

terraform {
  backend "gcs" {
    bucket  = "sv-tf-state"
    prefix  = "content"
  }
}
