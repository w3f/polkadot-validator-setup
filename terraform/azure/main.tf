resource "azurerm_resource_group" "main-{{ name }}" {
  name     = "{{name}}"
  location = var.location
}

resource "azurerm_virtual_network" "main-{{ name }}" {
  name                = "{{name}}"
  address_space       = ["10.0.0.0/16"]
  location            = "${azurerm_resource_group.main-{{ name }}.location}"
  resource_group_name = "${azurerm_resource_group.main-{{ name }}.name}"
}

resource "azurerm_subnet" "internal-{{ name }}" {
  name                      = "{{name}}"
  resource_group_name       = "${azurerm_resource_group.main-{{ name }}.name}"
  virtual_network_name      = "${azurerm_virtual_network.main-{{ name }}.name}"
  address_prefix            = "10.0.2.0/24"
}

resource "azurerm_network_interface" "main-{{ name }}" {
  name                = "{{name}}-${count.index}"
  location            = "${azurerm_resource_group.main-{{ name }}.location}"
  resource_group_name = "${azurerm_resource_group.main-{{ name }}.name}"
  count               = var.node_count

  ip_configuration {
    name                          = "testconfiguration1"
    subnet_id                     = "${azurerm_subnet.internal-{{ name }}.id}"
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = "${azurerm_public_ip.main-{{ name }}[count.index].id}"
  }
}

resource "azurerm_public_ip" "main-{{ name }}" {
  name                    = "{{name}}-${count.index}"
  location                = "${azurerm_resource_group.main-{{ name }}.location}"
  resource_group_name     = "${azurerm_resource_group.main-{{ name }}.name}"
  allocation_method       = "Static"
  sku                     = "Standard"
  idle_timeout_in_minutes = 30
  count                   = var.node_count

  tags = {
    name = "{{name}}-${count.index}"
  }
}

resource "azurerm_virtual_machine" "main-{{ name }}" {
  name                  = "{{name}}-${count.index}"
  location              = "${azurerm_resource_group.main-{{ name }}.location}"
  resource_group_name   = "${azurerm_resource_group.main-{{ name }}.name}"
  network_interface_ids = ["${azurerm_network_interface.main-{{ name }}[count.index].id}"]
  vm_size               = "Standard_DS1_v2"
  count                 = var.node_count

  delete_os_disk_on_termination = true

  delete_data_disks_on_termination = true

  storage_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = var.image
    version   = "latest"
  }
  storage_os_disk {
    name              = "myosdisk-${count.index}"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
    disk_size_gb      = 400
  }
  os_profile {
    computer_name = "{{name}}-${count.index}"
    admin_username = var.ssh_user
  }

  os_profile_linux_config {
    disable_password_authentication = true
    ssh_keys {
      key_data = var.public_key
      path     = "/home/${var.ssh_user}/.ssh/authorized_keys"
    }
  }
  tags = {
    name = "{{name}}-${count.index}"
  }
}

data "azurerm_public_ip" "main-{{ name }}" {
  name                = "${azurerm_public_ip.main-{{ name }}[count.index].name}"
  resource_group_name = "${azurerm_resource_group.main-{{ name }}.name}"
  count               = var.node_count
}

resource "azurerm_network_security_group" "main-{{ name }}" {
  name                = "{{name}}"
  location            = "${azurerm_resource_group.main-{{ name }}.location}"
  resource_group_name = "${azurerm_resource_group.main-{{ name }}.name}"

  tags = {
    name = "{{name}}"
  }
}

resource "azurerm_network_security_rule" "outbound-{{ name }}" {
  name                        = "ssh"
  priority                    = 100
  direction                   = "Outbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = "${azurerm_resource_group.main-{{ name }}.name}"
  network_security_group_name = "${azurerm_network_security_group.main-{{ name }}.name}"
}

resource "azurerm_network_security_rule" "sshIn-{{ name }}" {
  name                        = "sshIn"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = "${azurerm_resource_group.main-{{ name }}.name}"
  network_security_group_name = "${azurerm_network_security_group.main-{{ name }}.name}"
}

resource "azurerm_network_security_rule" "p2pIn-{{ name }}" {
  name                        = "p2pIn"
  priority                    = 101
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "30333"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = "${azurerm_resource_group.main-{{ name }}.name}"
  network_security_group_name = "${azurerm_network_security_group.main-{{ name }}.name}"
}

resource "azurerm_network_security_rule" "p2pIn-proxy-{{ name }}" {
  name                        = "p2pIn-proxy"
  priority                    = 101
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "80"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = "${azurerm_resource_group.main-{{ name }}.name}"
  network_security_group_name = "${azurerm_network_security_group.main-{{ name }}.name}"
}

resource "azurerm_network_security_rule" "vpnIn-{{ name }}" {
  name                        = "vpnIn"
  priority                    = 102
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Udp"
  source_port_range           = "*"
  destination_port_range      = "51820"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = "${azurerm_resource_group.main-{{ name }}.name}"
  network_security_group_name = "${azurerm_network_security_group.main-{{ name }}.name}"
}

resource "azurerm_network_security_rule" "node-exporter-{{ name }}" {
  name                        = "nodeExporterIn"
  priority                    = 103
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "9100"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = "${azurerm_resource_group.main-{{ name }}.name}"
  network_security_group_name = "${azurerm_network_security_group.main-{{ name }}.name}"
}

resource "azurerm_subnet_network_security_group_association" "main-{{ name }}" {
  subnet_id                 = "${azurerm_subnet.internal-{{ name }}.id}"
  network_security_group_id = "${azurerm_network_security_group.main-{{ name }}.id}"
}
