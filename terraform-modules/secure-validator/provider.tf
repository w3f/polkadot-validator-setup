provider "packet" {
  auth_token = var.packet_auth_token
  version = "~>2.3"
}

provider "aws" {
  region = var.aws_region
}

provider "azurerm" {
  version = "~>1.5"
}

provider "google" {
  project     = var.gcp_project
}
