variable "state_project" {
  default = "polkadot-benchmarks"
}

variable "project_id" {
  default = "polkadot-benchmarks"
}

variable "location" {
  default = "us-east1"
}

variable "zone" {
  default = "us-east1-b"
}

variable "machine_type" {
  default = "n1-standard-2"
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
  default = "1804"
}
