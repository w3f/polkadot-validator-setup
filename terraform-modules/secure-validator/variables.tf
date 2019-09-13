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
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC00G0RD6FW6Vn/kH7POW8qT9oqlsqNNtoNlGsnt/OYa+4ketST4OdT7aXaD2exRSPtrV6nyAUnr03KCH0a7B5YdAvWwhly+P27jAwcwnlJ0XizbmoPR4oA8I1UXksj3jbzqtyj1cyY6zdnWwVYW7vmFzTfrPUjFEvJRWBiwK4gqlPaUDQaOcAtQ38fGPpv0X4pS5K42fxfihOEDApDKf12AB/8Rsd98uymR9lUZ8YElAmnia1ql3xWLC6JP04VfNP3NWYG27jVfggAY9hGCdJ0SPhg4qqUQ9CD9WW2P0yovHdgzeUj0dZINWED3fG0N4TimfXDNAAY6lMGryELxCpN devops@web3.foundation"
}

variable "public_node_public_key" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDqaZLcaObIN87RVHf+eI+TvXEAyFe9hCDBnJFohM0KYZYgqfihpyBgwCzF1RzC2w1/+ypwZ4Lv8CNnFp22C2p03ANoeXfoJS3jPDeIr6a1PvzH9qPx+zNc6kEW5aD8oA2KuJB1+plPZ881toW2WBk6Y0n5vI3CEo2UFiXjWC4uCsMhvhmhOXtQiXlEOgighkE3jZqiPUQduJ+FPl5rqCd+yMVpSTOYR5/cOCmhfLv2ogyBkxQV7cAKJZqIVKG3XK8axXHHrIx5gBMAT3HDYWg20S8gffZhEK1a7iLhzGYznCG2C+V72msUFjWyOSTw/vaaBr4cy9rAi0lkajgcfi+n devops@web3.foundation"
}

variable "ssh_user" {
  default = "admin"
}
