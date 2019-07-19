provider "google" {
  project     = "polkadot-benchmarks"
  credentials = ""
}

terraform {
  backend "gcs" {
    bucket  = "sv-tf-state"
    prefix  = "content"
  }
}
