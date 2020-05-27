variable "state_project" {
  default = "polkadot-benchmarks"
}

variable "project_id" {
  default = "polkadot-benchmarks"
}

variable "client_id" {}
variable "client_secret" {}

variable "location" {
  default = "japanwest"
}

variable "zone" {
  default = ""
}

variable "machine_type" {
  default = "Standard_D2s_v3"
}

variable "public_key" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDqaZLcaObIN87RVHf+eI+TvXEAyFe9hCDBnJFohM0KYZYgqfihpyBgwCzF1RzC2w1/+ypwZ4Lv8CNnFp22C2p03ANoeXfoJS3jPDeIr6a1PvzH9qPx+zNc6kEW5aD8oA2KuJB1+plPZ881toW2WBk6Y0n5vI3CEo2UFiXjWC4uCsMhvhmhOXtQiXlEOgighkE3jZqiPUQduJ+FPl5rqCd+yMVpSTOYR5/cOCmhfLv2ogyBkxQV7cAKJZqIVKG3XK8axXHHrIx5gBMAT3HDYWg20S8gffZhEK1a7iLhzGYznCG2C+V72msUFjWyOSTw/vaaBr4cy9rAi0lkajgcfi+n devops@web3.foundation"
}

variable "ssh_user" {
  default = "admin"
}

variable "node_count" {
  default = 1
}

variable "name" {
  default = "node"
}

variable "image" {
  default = "18.04-LTS"
}
