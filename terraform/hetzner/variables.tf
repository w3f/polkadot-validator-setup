variable "hcloud_token" {
  default = "your token"
}

variable "public_key_validator" {
  default = "<your key>"
}

variable "public_key_prometheus" {
  default = "<your key>"
}

variable "public_key_name" {
  default = "key-name"
}

variable "node_count" {
  type = number
  default = 1
}

variable "server_type" {
  default = "cx41"
}

variable "server_type_monitoring" {
  default = "cx21"
}

variable "location" {
  default = "nbg1"
}

variable "image" {
  default = "ubuntu-20.04"
}

variable "password" {
  default = ""
}
