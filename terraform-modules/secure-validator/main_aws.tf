variable "public1_prefix" {
  default = "sv-public1"
}

resource "aws_key_pair" "public1" {
  key_name   = var.public1_prefix
  public_key = var.public1_public_key
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

resource "aws_instance" "public1" {
  ami           = "${data.aws_ami.ubuntu.id}"
  instance_type = var.aws_machine_type
  key_name      = var.public1_prefix
  tags = {
    Name = var.public1_prefix
  }
}
