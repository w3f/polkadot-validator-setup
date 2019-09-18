output "ip_address" {
  value = "${data.azurerm_public_ip.main.*.ip_address}"
}
