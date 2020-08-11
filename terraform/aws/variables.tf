variable "state_project" {
  default = "my_project"
}

variable "project_id" {
  default = "my_project"
}

variable "location" {
  default = "eu-central-1"
}

variable "zone" {
  default = "eu-central-1a"
}

variable "machine_type" {
  default = "m4.large"
}

variable "public_key" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDqaZLcaObIN87RVHf+eI+TvXEAyFe9hCDBnJFohM0KYZYgqfihpyBgwCzF1RzC2w1/+ypwZ4Lv8CNnFp22C2p03ANoeXfoJS3jPDeIr6a1PvzH9qPx+zNc6kEW5aD8oA2KuJB1+plPZ881toW2WBk6Y0n5vI3CEo2UFiXjWC4uCsMhvhmhOXtQiXlEOgighkE3jZqiPUQduJ+FPl5rqCd+yMVpSTOYR5/cOCmhfLv2ogyBkxQV7cAKJZqIVKG3XK8axXHHrIx5gBMAT3HDYWg20S8gffZhEK1a7iLhzGYznCG2C+V72msUFjWyOSTw/vaaBr4cy9rAi0lkajgcfi+n devops@web3.foundation"
}

variable "ssh_user" {
  default = ""
}

variable "node_count" {
  default = 1
}

variable "name" {
  default = "node"
}

variable "image" {
  default = "ami-0e6273fe5a9a1ad93"
}
