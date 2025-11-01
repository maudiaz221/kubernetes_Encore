# Kubernetes Quick Reference Card 📝

## 🎯 Essential kubectl Commands

### Get Information
```bash
# Get all resources
kubectl get all -n api-dash

# Get specific resource type
kubectl get pods -n api-dash
kubectl get deployments -n api-dash
kubectl get services -n api-dash
kubectl get configmaps -n api-dash
kubectl get secrets -n api-dash

# Get with more details
kubectl get pods -n api-dash -o wide
kubectl get pods -n api-dash -o yaml

# Watch resources in real-time
kubectl get pods -n api-dash --watch
```

### Describe Resources
```bash
# Detailed information about a resource
kubectl describe pod <pod-name> -n api-dash
kubectl describe deployment api-dash -n api-dash
kubectl describe service api-service -n api-dash
```

### Logs
```bash
# View logs
kubectl logs <pod-name> -n api-dash

# Follow logs (live)
kubectl logs <pod-name> -n api-dash -f

# Last 100 lines
kubectl logs <pod-name> -n api-dash --tail=100

# Previous container logs (if crashed)
kubectl logs <pod-name> -n api-dash --previous

# Logs from all pods with a label
kubectl logs -n api-dash -l app=api-dash --tail=50
```

### Execute Commands
```bash
# Get shell in a pod
kubectl exec -it <pod-name> -n api-dash -- /bin/sh

# Run a single command
kubectl exec <pod-name> -n api-dash -- ls -la

# Run debug pod
kubectl run -it --rm debug --image=busybox -n api-dash -- sh
```

### Apply & Delete
```bash
# Apply configuration
kubectl apply -f file.yaml
kubectl apply -f k8s/

# Delete resources
kubectl delete -f file.yaml
kubectl delete pod <pod-name> -n api-dash
kubectl delete namespace api-dash
```

### Port Forwarding
```bash
# Forward local port to pod
kubectl port-forward <pod-name> 8080:4000 -n api-dash

# Forward to service
kubectl port-forward svc/api-service 8080:80 -n api-dash
```

### Scaling
```bash
# Scale deployment
kubectl scale deployment api-dash --replicas=5 -n api-dash

# Autoscale
kubectl autoscale deployment api-dash --min=2 --max=10 --cpu-percent=70 -n api-dash
```

### Rolling Updates
```bash
# Update image
kubectl set image deployment/api-dash api-dash=api-dash:v2.0 -n api-dash

# Check rollout status
kubectl rollout status deployment/api-dash -n api-dash

# Rollout history
kubectl rollout history deployment/api-dash -n api-dash

# Rollback
kubectl rollout undo deployment/api-dash -n api-dash
```

### Resource Usage
```bash
# Top nodes
kubectl top nodes

# Top pods
kubectl top pods -n api-dash

# Top pods sorted by memory
kubectl top pods -n api-dash --sort-by=memory
```

### Configuration
```bash
# View context
kubectl config current-context

# List contexts
kubectl config get-contexts

# Switch context
kubectl config use-context <context-name>

# Set namespace
kubectl config set-context --current --namespace=api-dash
```

### Events
```bash
# View events
kubectl get events -n api-dash

# Sorted by time
kubectl get events -n api-dash --sort-by='.lastTimestamp'

# Watch events
kubectl get events -n api-dash --watch
```

### Explain Resources
```bash
# Get documentation
kubectl explain pod
kubectl explain deployment.spec
kubectl explain service.spec.ports
```

## 🔍 Debugging Checklist

### Pod Won't Start
1. `kubectl describe pod <pod-name> -n api-dash` - Check Events section
2. `kubectl logs <pod-name> -n api-dash` - Check application logs
3. Check image name and tag
4. Verify ConfigMaps and Secrets exist
5. Check resource requests/limits

### Can't Connect to Service
1. `kubectl get svc -n api-dash` - Verify service exists
2. `kubectl describe svc <service-name> -n api-dash` - Check endpoints
3. `kubectl get pods -n api-dash -l app=<label>` - Verify pods are running
4. Test DNS: `kubectl run -it --rm debug --image=busybox -n api-dash -- nslookup <service-name>`
5. Check NetworkPolicies

### Database Connection Issues
1. Verify PostgreSQL pod is running
2. Check database credentials in Secret
3. Verify DATABASE_URL format
4. Test connection from debug pod
5. Check service name and port

### Application Crashes
1. `kubectl logs <pod-name> -n api-dash --previous` - Previous logs
2. Check resource limits (OOMKilled?)
3. Verify environment variables
4. Check database migration status

## 📊 Monitoring Commands

```bash
# Resource usage
kubectl top nodes
kubectl top pods -n api-dash

# Check HPA
kubectl get hpa -n api-dash

# Cluster info
kubectl cluster-info

# API versions
kubectl api-versions

# API resources
kubectl api-resources
```

## 🛠️ Useful Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kdp='kubectl describe pod'
alias kl='kubectl logs'
alias klf='kubectl logs -f'
alias ke='kubectl exec -it'
alias ka='kubectl apply -f'
alias kd='kubectl delete'
alias kn='kubectl config set-context --current --namespace'
```

## 🎨 Output Formats

```bash
# YAML
kubectl get pod <pod-name> -n api-dash -o yaml

# JSON
kubectl get pod <pod-name> -n api-dash -o json

# Wide (more columns)
kubectl get pods -n api-dash -o wide

# Custom columns
kubectl get pods -n api-dash -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,IP:.status.podIP

# JSONPath
kubectl get pods -n api-dash -o jsonpath='{.items[*].metadata.name}'
```

## 🔐 Working with Secrets

```bash
# Create secret from literal
kubectl create secret generic my-secret --from-literal=key=value -n api-dash

# Create secret from file
kubectl create secret generic my-secret --from-file=./secret.txt -n api-dash

# Decode secret
kubectl get secret postgres-secret -n api-dash -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d

# View all secrets
kubectl get secrets -n api-dash
```

## 📦 Working with ConfigMaps

```bash
# Create from literal
kubectl create configmap my-config --from-literal=key=value -n api-dash

# Create from file
kubectl create configmap my-config --from-file=config.json -n api-dash

# View configmap
kubectl get configmap my-config -n api-dash -o yaml
```

## 🧹 Cleanup Commands

```bash
# Delete namespace (deletes everything in it)
kubectl delete namespace api-dash

# Delete by file
kubectl delete -f k8s/

# Delete by label
kubectl delete pods -l app=api-dash -n api-dash

# Delete all pods
kubectl delete pods --all -n api-dash

# Force delete stuck pod
kubectl delete pod <pod-name> -n api-dash --grace-period=0 --force
```

## 💡 Pro Tips

1. **Use `--dry-run=client`** to test without applying:
   ```bash
   kubectl apply -f file.yaml --dry-run=client -o yaml
   ```

2. **Use `kubectl diff`** to see changes before applying:
   ```bash
   kubectl diff -f file.yaml
   ```

3. **Use labels** for everything:
   ```bash
   kubectl get pods -l app=api-dash,version=v1
   ```

4. **Use `kubectl wait`** in scripts:
   ```bash
   kubectl wait --for=condition=ready pod -l app=api-dash -n api-dash --timeout=60s
   ```

5. **Generate YAML from running resources**:
   ```bash
   kubectl get deployment api-dash -n api-dash -o yaml > backup.yaml
   ```

---

Keep this handy while working with Kubernetes! 📌

