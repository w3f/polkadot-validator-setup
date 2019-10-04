output "ip_address" {
  value = "${data.azurerm_public_ip.main-{{ name }}.*.ip_address}"
}
