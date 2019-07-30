variable "client_id" {}
variable "client_secret" {}
variable "packet_auth_token" {}

variable "packet_location" {
  default = "ewr1"
}

variable "packet_machine_type" {
  default = "t1.small.x86"
}

variable "packet_operating_system" {
  default = "ubuntu_18_04"
}

variable "packet_project_id" {
  default = "f015db86-1b97-4df7-9be8-b33cb7670960"
}

variable "aws_region" {
  default = "eu-central-1"
}

variable "aws_az" {
  default = "eu-central-1a"
}


variable "aws_machine_type" {
  default = "m4.large"
}


variable "azure_region" {
  default = "japanwest"
}

variable "azure_machine_type" {
  default = "Standard_D2s_v3"
}


variable "gcp_project" {
  default = "polkadot-benchmarks"
}

variable "gcp_region" {
  default = "us-east1"
}

variable "gcp_zone" {
  default = "us-east1-b"
}

variable "gcp_machine_type" {
  default = "n1-standard-2"
}

variable "gcp_operating_system" {
  default = "ubuntu-os-cloud/ubuntu-1804-lts"
}

variable "validator_public_key" {
  default = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFcsOxKXAYhJ6YEj1CWCB689VY1h9TUHR2yh8OWdVl7L devops@web3.foundation"
}

variable "public1_public_key" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDqaZLcaObIN87RVHf+eI+TvXEAyFe9hCDBnJFohM0KYZYgqfihpyBgwCzF1RzC2w1/+ypwZ4Lv8CNnFp22C2p03ANoeXfoJS3jPDeIr6a1PvzH9qPx+zNc6kEW5aD8oA2KuJB1+plPZ881toW2WBk6Y0n5vI3CEo2UFiXjWC4uCsMhvhmhOXtQiXlEOgighkE3jZqiPUQduJ+FPl5rqCd+yMVpSTOYR5/cOCmhfLv2ogyBkxQV7cAKJZqIVKG3XK8axXHHrIx5gBMAT3HDYWg20S8gffZhEK1a7iLhzGYznCG2C+V72msUFjWyOSTw/vaaBr4cy9rAi0lkajgcfi+n devops@web3.foundation"
}
variable "public2_public_key" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCZb81IoX4l+MyHtY9W82bYeVJ467h9gKi6azWSysvzExbseWVqwTu2uDMGWg8Aw9T8mmiHty3V/nLDxH+uwxfzBdHxz0c54NzYieF9udvJmcbZ6AIERICWyev5IVLTrDZNNGhoN3W1+JwUyFBtRx9PsZ7sJtwJ8uxSItIAJEuwxiotDk+c5nPIogdLBO2tCOihb619BcZ2zc4DF0jJV2ghCsHkYVAa3szSvxEF/3DRFkUFLgS/6epzEr1Xau/XGby9EzROu8ydtXNPOEMt9pfGI9ozdnguKrvOGTrjFkz7ootMmXmtt52epsYlRCntxCpzNzv+BFzzoUh9ugIBYhdj devops@web3.foundation"
}
variable "public3_public_key" {
  default = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMfjjOl/qpoQHndrqJHcNIUb8tyJKyHNwAh9eR2G10Y7 devops@web3.foundation"
}
