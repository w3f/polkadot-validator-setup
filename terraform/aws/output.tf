output "ip_address" {
  value = "${aws_instance.main-{{ name }}.*.public_ip}"
}
