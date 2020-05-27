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
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC00G0RD6FW6Vn/kH7POW8qT9oqlsqNNtoNlGsnt/OYa+4ketST4OdT7aXaD2exRSPtrV6nyAUnr03KCH0a7B5YdAvWwhly+P27jAwcwnlJ0XizbmoPR4oA8I1UXksj3jbzqtyj1cyY6zdnWwVYW7vmFzTfrPUjFEvJRWBiwK4gqlPaUDQaOcAtQ38fGPpv0X4pS5K42fxfihOEDApDKf12AB/8Rsd98uymR9lUZ8YElAmnia1ql3xWLC6JP04VfNP3NWYG27jVfggAY9hGCdJ0SPhg4qqUQ9CD9WW2P0yovHdgzeUj0dZINWED3fG0N4TimfXDNAAY6lMGryELxCpN devops@web3.foundation"
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
