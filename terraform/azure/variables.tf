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
  default = ""
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
