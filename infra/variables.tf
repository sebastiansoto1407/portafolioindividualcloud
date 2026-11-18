variable "compartment_ocid" {
  description = "Compartimento donde se crearán la VCN y la VM."
  type        = string
}

variable "availability_domain" {
  description = "Availability domain de la VM en la región seleccionada."
  type        = string
}

variable "ubuntu_2404_image_ocid" {
  description = "OCID regional de una imagen Canonical Ubuntu 24.04 compatible con el shape."
  type        = string
}

variable "ssh_public_key" {
  description = "Clave pública SSH para el usuario ubuntu."
  type        = string
}

variable "instance_shape" {
  description = "Shape OCI; debe ser compatible con la imagen y con la cuota disponible."
  type        = string
  default     = "VM.Standard.E2.1.Micro"
}

