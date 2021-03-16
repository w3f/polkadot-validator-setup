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
  default = ""
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
