terraform {
  required_version = ">= 1.10.0"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 9.0"
    }
  }
}

provider "oci" {}

variable "compartment_ocid" {
  description = "Compartimento OCI para el bucket privado de estado."
  type        = string
}

variable "region" {
  description = "Región OCI donde se guarda el estado."
  type        = string
}

data "oci_objectstorage_namespace" "current" {
  compartment_id = var.compartment_ocid
}

resource "oci_objectstorage_bucket" "state" {
  compartment_id = var.compartment_ocid
  namespace      = data.oci_objectstorage_namespace.current.namespace
  name           = "portafoliocloud-tfstate-20261118"
  access_type    = "NoPublicAccess"
  versioning     = "Enabled"
}

resource "oci_objectstorage_preauthrequest" "state" {
  namespace    = data.oci_objectstorage_namespace.current.namespace
  bucket       = oci_objectstorage_bucket.state.name
  name         = "portafoliocloud-terraform-state"
  access_type  = "ObjectReadWrite"
  object_name  = "terraform.tfstate"
  time_expires = "2027-11-18T23:59:59Z"
}

output "state_par_url" {
  description = "Guardar solo en el secret OCI_STATE_PAR_URL de GitHub."
  value       = "https://objectstorage.${var.region}.oraclecloud.com${oci_objectstorage_preauthrequest.state.access_uri}"
  sensitive   = true
}
