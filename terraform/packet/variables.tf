variable "state_project" {
  default = ""
}

variable "project_id" {
  default = "my_project_id"
}

variable "auth_token" {}

variable "location" {
  default = "ewr1"
}

variable "zone" {
  default = ""
}

variable "machine_type" {
  default = "t1.small.x86"
}

variable "public_key" {
  default = ""
}

variable "ssh_user" {
  default = ""
}

variable "node_count" {
  default = 1
}

variable "name" {
  default = "w3f"
}

variable "image" {
  default = "ubuntu_18_04"
}
