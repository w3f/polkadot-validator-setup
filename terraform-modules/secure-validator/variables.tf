variable "packet_auth_token" {}

variable "location" {
  default = "ewr1"
}

variable "machine_type" {
  default = "t1.small.x86"
}

variable "operating_system" {
  default = "ubuntu_18_04"
}

variable "project_id" {
  default = "f015db86-1b97-4df7-9be8-b33cb7670960"
}

variable "public_key" {
  default = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFcsOxKXAYhJ6YEj1CWCB689VY1h9TUHR2yh8OWdVl7L devops@web3.foundation"
}
