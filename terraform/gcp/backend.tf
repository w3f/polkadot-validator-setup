terraform {
  backend "gcs" {
    bucket  = "${var.name}-sv-tf-state"
    prefix  = "gcp"
  }
}
