terraform {
  backend "gcs" {
    bucket  = "sv-tf-state"
    prefix  = "content"
  }
}
