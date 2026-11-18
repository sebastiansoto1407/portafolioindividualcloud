output "public_ip" {
  description = "IP pública de la VM Ubuntu."
  value       = oci_core_instance.web.public_ip
}

output "vcn_id" {
  value = oci_core_vcn.portfolio.id
}

output "public_subnet_id" {
  value = oci_core_subnet.public.id
}

output "private_subnet_id" {
  value = oci_core_subnet.private.id
}

