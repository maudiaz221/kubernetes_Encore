# Kubernetes Deployment Guide - Learn by Doing 🚀

This guide will walk you through deploying your Encore.ts Todo API to a Kubernetes cluster step by step.

## 📋 Prerequisites

Before starting, make sure you have:
- [x] Docker installed
- [ ] kubectl installed (`curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"`)
- [ ] Minikube or Kind installed (for local cluster)
- [ ] Basic understanding of Docker

---

## 🎯 Learning Path

### Phase 1: Prepare Your Application (30 mins)

#### Step 1.1: Create a Dockerfile
**What you're learning:** How to containerize your Node.js application

Create a file named `Dockerfile` in the project root:

```dockerfile
# Multi-stage build for smaller image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build if needed (TypeScript compilation)
RUN npm run build || true

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app .

# Expose the port Encore uses
EXPOSE 4000

# Start the application
CMD ["encore", "run"]
```

**Action items:**
- [ ] Create the Dockerfile
- [ ] Build the image: `docker build -t api-dash:v1.0 .`
- [ ] Test it locally: `docker run -p 4000:4000 -e DATABASE_URL="your-db-url" api-dash:v1.0`

---

#### Step 1.2: Set Up Local Kubernetes Cluster
**What you're learning:** How to create a local development cluster

**Choose ONE:**

**Option A: Minikube**
```bash
# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start cluster
minikube start --driver=docker

# Verify
kubectl get nodes
```

**Option B: Kind (Kubernetes in Docker)**
```bash
# Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster
kind create cluster --name api-dash-cluster

# Verify
kubectl cluster-info
```

**Action items:**
- [ ] Choose and install a local Kubernetes solution
- [ ] Start your cluster
- [ ] Run `kubectl get nodes` to verify it's running

---

### Phase 2: Deploy PostgreSQL Database (45 mins)

#### Step 2.1: Create Kubernetes Namespace
**What you're learning:** How to organize resources in Kubernetes

Create `k8s/namespace.yaml`:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: api-dash
  labels:
    name: api-dash
```

Apply it:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl get namespaces
```

---

#### Step 2.2: Create PostgreSQL ConfigMap
**What you're learning:** How to manage configuration data

Create `k8s/postgres-configmap.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
  namespace: api-dash
data:
  POSTGRES_DB: tododb
  POSTGRES_USER: postgres
```

---

#### Step 2.3: Create PostgreSQL Secret
**What you're learning:** How to securely store sensitive data

Create `k8s/postgres-secret.yaml`:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: api-dash
type: Opaque
data:
  # Base64 encoded password (echo -n 'postgres' | base64)
  POSTGRES_PASSWORD: cG9zdGdyZXM=
```

**Security Note:** In production, use proper secret management tools like Sealed Secrets or external secret managers.

---

#### Step 2.4: Create PostgreSQL PersistentVolume
**What you're learning:** How to persist data in Kubernetes

Create `k8s/postgres-pv.yaml`:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data/postgres"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: api-dash
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

---

#### Step 2.5: Deploy PostgreSQL
**What you're learning:** Deployments and StatefulSets

Create `k8s/postgres-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: api-dash
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        envFrom:
        - configMapRef:
            name: postgres-config
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
          subPath: postgres
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: api-dash
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
```

**Action items:**
- [ ] Create the `k8s/` directory
- [ ] Create all PostgreSQL files
- [ ] Apply them in order:
  ```bash
  kubectl apply -f k8s/postgres-configmap.yaml
  kubectl apply -f k8s/postgres-secret.yaml
  kubectl apply -f k8s/postgres-pv.yaml
  kubectl apply -f k8s/postgres-deployment.yaml
  ```
- [ ] Verify: `kubectl get pods -n api-dash`
- [ ] Check logs: `kubectl logs -n api-dash <postgres-pod-name>`

---

### Phase 3: Deploy Your API (60 mins)

#### Step 3.1: Push Image to Registry
**What you're learning:** Container registries and image management

If using Minikube:
```bash
# Use Minikube's Docker daemon
eval $(minikube docker-env)
docker build -t api-dash:v1.0 .
```

If using Kind:
```bash
# Build and load into Kind
docker build -t api-dash:v1.0 .
kind load docker-image api-dash:v1.0 --name api-dash-cluster
```

---

#### Step 3.2: Create API ConfigMap
**What you're learning:** Environment configuration for your app

Create `k8s/api-configmap.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: api-dash
data:
  NODE_ENV: "production"
  PORT: "4000"
```

---

#### Step 3.3: Create API Secret
**What you're learning:** Managing database credentials

Create `k8s/api-secret.yaml`:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secret
  namespace: api-dash
type: Opaque
stringData:
  DATABASE_URL: "postgresql://postgres:postgres@postgres-service:5432/tododb"
```

---

#### Step 3.4: Deploy Your API
**What you're learning:** Deployments, replicas, health checks

Create `k8s/api-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-dash
  namespace: api-dash
spec:
  replicas: 3  # Run 3 instances for high availability
  selector:
    matchLabels:
      app: api-dash
  template:
    metadata:
      labels:
        app: api-dash
    spec:
      containers:
      - name: api-dash
        image: api-dash:v1.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 4000
        envFrom:
        - configMapRef:
            name: api-config
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: api-secret
              key: DATABASE_URL
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health  # You'll need to add this endpoint
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: api-dash
spec:
  selector:
    app: api-dash
  ports:
  - port: 80
    targetPort: 4000
  type: ClusterIP
```

---

#### Step 3.5: Create Ingress (Optional but Recommended)
**What you're learning:** External access to your services

Create `k8s/ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: api-dash
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: api-dash.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```

For Minikube, enable ingress:
```bash
minikube addons enable ingress
```

**Action items:**
- [ ] Create all API Kubernetes files
- [ ] Apply them:
  ```bash
  kubectl apply -f k8s/api-configmap.yaml
  kubectl apply -f k8s/api-secret.yaml
  kubectl apply -f k8s/api-deployment.yaml
  kubectl apply -f k8s/ingress.yaml
  ```
- [ ] Check deployment: `kubectl get deployments -n api-dash`
- [ ] Check pods: `kubectl get pods -n api-dash`
- [ ] View logs: `kubectl logs -n api-dash -l app=api-dash --tail=50`

---

### Phase 4: Run Database Migrations (15 mins)

#### Step 4.1: Create Migration Job
**What you're learning:** Kubernetes Jobs for one-time tasks

Create `k8s/migration-job.yaml`:
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  namespace: api-dash
spec:
  template:
    spec:
      containers:
      - name: migration
        image: api-dash:v1.0
        command: ["npm", "run", "db:push"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: api-secret
              key: DATABASE_URL
      restartPolicy: Never
  backoffLimit: 3
```

Apply and watch:
```bash
kubectl apply -f k8s/migration-job.yaml
kubectl logs -n api-dash job/db-migration -f
```

---

### Phase 5: Test and Verify (30 mins)

#### Step 5.1: Access Your API

**Option 1: Port Forward (Quick Test)**
```bash
kubectl port-forward -n api-dash svc/api-service 8080:80
curl http://localhost:8080/auth/signup -X POST -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

**Option 2: Using Minikube Service**
```bash
minikube service api-service -n api-dash
```

**Option 3: Using Ingress**
```bash
# Add to /etc/hosts
echo "$(minikube ip) api-dash.local" | sudo tee -a /etc/hosts

# Test
curl http://api-dash.local/auth/signup -X POST -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

#### Step 5.2: Useful Debugging Commands

```bash
# Get all resources
kubectl get all -n api-dash

# Describe a pod
kubectl describe pod -n api-dash <pod-name>

# View logs
kubectl logs -n api-dash <pod-name> --tail=100 -f

# Execute commands in a pod
kubectl exec -it -n api-dash <pod-name> -- /bin/sh

# Check events
kubectl get events -n api-dash --sort-by='.lastTimestamp'

# Port forward to postgres
kubectl port-forward -n api-dash svc/postgres-service 5432:5432

# Scale deployment
kubectl scale deployment api-dash -n api-dash --replicas=5
```

---

### Phase 6: Advanced Topics (Learn After Basics)

#### 6.1: Horizontal Pod Autoscaler
**What you're learning:** Auto-scaling based on metrics

Create `k8s/hpa.yaml`:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-dash-hpa
  namespace: api-dash
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-dash
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

#### 6.2: Resource Quotas
**What you're learning:** Limiting resource consumption

Create `k8s/resource-quota.yaml`:
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: api-dash-quota
  namespace: api-dash
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "5"
```

---

#### 6.3: Network Policies
**What you're learning:** Securing pod communication

Create `k8s/network-policy.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-dash-network-policy
  namespace: api-dash
spec:
  podSelector:
    matchLabels:
      app: api-dash
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 4000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

---

## 🎓 Learning Checklist

### Basics
- [ ] Understand Pods (smallest deployable units)
- [ ] Understand Deployments (manage replica sets)
- [ ] Understand Services (networking/load balancing)
- [ ] Understand ConfigMaps (configuration)
- [ ] Understand Secrets (sensitive data)
- [ ] Understand PersistentVolumes (storage)

### Intermediate
- [ ] Understand Namespaces (resource isolation)
- [ ] Understand Ingress (external access)
- [ ] Understand Jobs (one-time tasks)
- [ ] Understand Resource limits & requests
- [ ] Understand Health checks (liveness/readiness)

### Advanced
- [ ] Understand HorizontalPodAutoscaler (auto-scaling)
- [ ] Understand NetworkPolicies (security)
- [ ] Understand StatefulSets (stateful applications)
- [ ] Understand RBAC (access control)
- [ ] Understand Helm (package manager)

---

## 📚 Common Issues and Solutions

### Issue: Pods not starting
```bash
# Check pod status
kubectl describe pod -n api-dash <pod-name>

# Check events
kubectl get events -n api-dash

# Common causes:
# - Image pull errors (wrong image name/tag)
# - Resource constraints
# - ConfigMap/Secret not found
```

### Issue: Can't connect to database
```bash
# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup postgres-service.api-dash.svc.cluster.local

# Test connection
kubectl run -it --rm debug --image=postgres:15-alpine --restart=Never -- psql -h postgres-service.api-dash -U postgres -d tododb
```

### Issue: Application crashes
```bash
# View logs
kubectl logs -n api-dash <pod-name> --previous

# Check resource usage
kubectl top pods -n api-dash
```

---

## 🚀 Next Steps

1. **Monitor your cluster:** Install Prometheus + Grafana
2. **Set up CI/CD:** Automate deployments with GitHub Actions
3. **Try Helm:** Package your app as a Helm chart
4. **Learn about Service Mesh:** Istio or Linkerd
5. **Deploy to a real cluster:** AWS EKS, GKE, or AKS

---

## 📖 Additional Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Kubernetes by Example](https://kubernetesbyexample.com/)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)
- [KataCoda Kubernetes Tutorials](https://www.katacoda.com/courses/kubernetes)

---

## 💡 Pro Tips

1. **Start small:** Get one pod running before adding complexity
2. **Use labels:** They're crucial for selectors and organization
3. **Check logs often:** `kubectl logs` is your best friend
4. **Use kubectl explain:** Learn about resources: `kubectl explain pod.spec`
5. **Practice imperative first:** Create resources with `kubectl create` before writing YAML
6. **Use dry-run:** Test YAML without applying: `kubectl apply -f file.yaml --dry-run=client`

---

Good luck with your Kubernetes journey! 🎉
Remember: Everyone struggles with K8s at first. Take it step by step!

