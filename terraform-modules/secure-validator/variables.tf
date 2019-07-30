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
  default = "us-east-1-b"
}

variable "gcp_machine_type" {
  default = "n1-standard-2"
}

variable "validator_public_key" {
  default = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFcsOxKXAYhJ6YEj1CWCB689VY1h9TUHR2yh8OWdVl7L devops@web3.foundation"
}

variable "public1_public_key" {
  default = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILq0ueTmsGILRMJt1bHPiubtw6MwlhTtUTzKmZMajxoU devops@web3.foundation"
}
variable "public2_public_key" {
  default = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINM8deBtW/OmROy6yoiMVy0xpVwU2KlCJNtlIMaDki2j devops@web3.foundation"
}
variable "public3_public_key" {
  default = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMfjjOl/qpoQHndrqJHcNIUb8tyJKyHNwAh9eR2G10Y7 devops@web3.foundation"
}
