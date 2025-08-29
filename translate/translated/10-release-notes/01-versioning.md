---
title: DeepFlow Versioning Rules
permalink: /release-notes/versioning
---

> This document was translated by ChatGPT

# Version Naming

DeepFlow follows the [Semantic Versioning](https://semver.org/) naming convention, with the version number format `X.Y.Z`, where `X` is the Major Version, `Y` is the Minor Version, and `Z` is the Patch Version.

# Iteration Cycle

- The major version number `X` changes approximately every **two years**.
- The minor version number `Y` changes approximately every **four months**.
- The patch version number `Z` changes approximately every **two weeks**.

# Version Maintenance Period

- The largest `Z` version within each `X.Y` release is designated as a Long-Term Support (LTS) version.
- After the release of each `X.Y.Z` version, all versions from `X.Y.0` to `X.Y.{Z-1}` will no longer be maintained or updated.