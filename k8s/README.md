# Kubernetes Manifests

This directory contains all Kubernetes configuration files for deploying the API Dashboard application.

## 📁 File Organization

Create these files following the guide in `KUBERNETES_DEPLOYMENT_GUIDE.md`:

```
k8s/
├── namespace.yaml              # Namespace definition
├── postgres-configmap.yaml     # PostgreSQL configuration
├── postgres-secret.yaml        # PostgreSQL credentials
├── postgres-pv.yaml           # Persistent storage for database
├── postgres-deployment.yaml    # PostgreSQL deployment & service
├── api-configmap.yaml         # API configuration
├── api-secret.yaml            # API secrets (DB connection)
├── api-deployment.yaml        # API deployment & service
├── ingress.yaml               # Ingress for external access
├── migration-job.yaml         # Database migration job
├── hpa.yaml                   # Horizontal Pod Autoscaler (optional)
├── resource-quota.yaml        # Resource limits (optional)
└── network-policy.yaml        # Network security (optional)
```

## 🚀 Quick Start

1. Apply in this order:
```bash
kubectl apply -f namespace.yaml
kubectl apply -f postgres-configmap.yaml
kubectl apply -f postgres-secret.yaml
kubectl apply -f postgres-pv.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f api-configmap.yaml
kubectl apply -f api-secret.yaml
kubectl apply -f api-deployment.yaml
kubectl apply -f ingress.yaml
kubectl apply -f migration-job.yaml
```

2. Or apply all at once:
```bash
kubectl apply -f k8s/
```

## 🧪 Verify Deployment

```bash
# Check all resources
kubectl get all -n api-dash

# Check pods are running
kubectl get pods -n api-dash

# Check services
kubectl get svc -n api-dash

# View logs
kubectl logs -n api-dash -l app=api-dash --tail=50
```

## 🔄 Update Deployment

When you make changes:

```bash
# Rebuild Docker image
docker build -t api-dash:v1.1 .

# Update in cluster (if using Minikube)
eval $(minikube docker-env)
docker build -t api-dash:v1.1 .

# Update deployment
kubectl set image deployment/api-dash api-dash=api-dash:v1.1 -n api-dash

# Or apply updated manifest
kubectl apply -f api-deployment.yaml
```

## 🗑️ Clean Up

```bash
# Delete everything in namespace
kubectl delete namespace api-dash

# Or delete individual resources
kubectl delete -f k8s/
```

