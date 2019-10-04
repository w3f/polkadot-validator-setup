resource "aws_key_pair" "key-{{ name }}" {
  key_name   = var.name
  public_key = var.public_key
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_vpc" "main-{{ name }}" {
  cidr_block = "172.26.0.0/16"

  enable_dns_hostnames = true

  enable_dns_support = true

  tags = {
    Name = var.name
  }
}

resource "aws_subnet" "main-{{ name }}" {
  cidr_block = "${cidrsubnet(aws_vpc.main-{{ name }}.cidr_block, 3, 1)}"

  vpc_id = "${aws_vpc.main-{{ name }}.id}"

  availability_zone = var.zone

  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "main-{{ name }}" {
  vpc_id = "${aws_vpc.main-{{ name }}.id}"

  tags = {
    Name = var.name
  }
}

resource "aws_route_table" "main-{{ name }}" {
  vpc_id = "${aws_vpc.main-{{ name }}.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.main-{{ name }}.id}"
  }

  tags = {
    Name = var.name
  }
}

resource "aws_route_table_association" "main-{{ name }}" {
  subnet_id      = "${aws_subnet.main-{{ name }}.id}"
  route_table_id = "${aws_route_table.main-{{ name }}.id}"
}

resource "aws_security_group" "main-{{ name }}" {
  name = "externalssh"
  vpc_id = "${aws_vpc.main-{{ name }}.id}"
}

resource "aws_security_group_rule" "externalssh-{{ name }}" {
  type            = "ingress"
  from_port       = 22
  to_port         = 22
  protocol        = "tcp"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.main-{{ name }}.id}"
}

resource "aws_security_group_rule" "p2p-{{ name }}" {
  type            = "ingress"
  from_port       = 30333
  to_port         = 30333
  protocol        = "tcp"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.main-{{ name }}.id}"
}

resource "aws_security_group_rule" "vpn-{{ name }}" {
  type            = "ingress"
  from_port       = 51820
  to_port         = 51820
  protocol        = "udp"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.main-{{ name }}.id}"
}

resource "aws_security_group_rule" "allow_all-{{ name }}" {
  type            = "egress"
  from_port       = 0
  to_port         = 0
  protocol        = "-1"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.main-{{ name }}.id}"
}

resource "aws_instance" "main-{{ name }}" {
  ami           = "${data.aws_ami.ubuntu.id}"
  instance_type = var.machine_type
  key_name      = var.name
  count         = var.node_count

  subnet_id              = "${aws_subnet.main-{{ name }}.id}"
  vpc_security_group_ids = ["${aws_security_group.main-{{ name }}.id}"]

  tags = {
    Name = "${var.name}-${count.index}"
  }
}
