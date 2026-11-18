terraform {
  required_version = ">= 1.10.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 9.0"
    }
  }

  # GitHub Actions configura la URL del estado con OCI_STATE_PAR_URL.
  backend "http" {}
}

