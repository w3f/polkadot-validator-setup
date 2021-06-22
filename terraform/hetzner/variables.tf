variable "name" {
  default = "w3f"
}

variable "hcloud_token" {
  default = "your token"
}

variable "public_key" {
  default = "<your key>"
}

variable "public_key_name" {
  default = "key-name"
}

variable "node_count" {
  type    = number
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

variable "password_hash" {
  default = "$6$Y.TqqXVTsCf91DQl$u72Gkgnb5gLkVjwNLhznzf/j740mfhhtVaH.6k0ghIkBEoQqXi0uSI8iYjiC486LpMM16c0GD8mmPwsfRq5NC1"
}

variable "ssh_user" {
  default = "polkadot"
}
