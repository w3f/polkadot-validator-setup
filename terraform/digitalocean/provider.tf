provider "digitalocean" {
  token = var.do_token
  version = "~> 1.16"
}

terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
  }
}
