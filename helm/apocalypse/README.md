# Apocalypse Helm Chart

This Helm chart deploys the Apocalypse Spring Boot application on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- PV provisioner support in the underlying infrastructure (for MySQL persistence)

## Installing the Chart

To install the chart with the release name `my-apocalypse`:

```bash
helm install my-apocalypse ./helm/apocalypse
```

## Uninstalling the Chart

To uninstall/delete the `my-apocalypse` deployment:

```bash
helm uninstall my-apocalypse
```

## Configuration

The following table lists the configurable parameters and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `2` |
| `image.repository` | Image repository | `apocalypse` |
| `image.tag` | Image tag | `latest` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `ingress.enabled` | Enable ingress | `false` |
| `resources.limits.cpu` | CPU limit | `1000m` |
| `resources.limits.memory` | Memory limit | `1Gi` |
| `autoscaling.enabled` | Enable HPA | `false` |
| `mysql.enabled` | Enable MySQL | `true` |

