# Kubernetes Learning Checklist ✅

Track your progress as you learn Kubernetes by deploying your Todo API!

## 🎯 Phase 1: Environment Setup

- [ ] Install kubectl
- [ ] Install Minikube or Kind
- [ ] Start your local Kubernetes cluster
- [ ] Verify cluster is running with `kubectl get nodes`
- [ ] Create Dockerfile for your application
- [ ] Build Docker image successfully
- [ ] Test Docker image locally

**Estimated Time:** 30-45 minutes

---

## 🗂️ Phase 2: Understanding Kubernetes Basics

### Namespaces
- [ ] Understand what namespaces are for
- [ ] Create `api-dash` namespace
- [ ] Verify namespace with `kubectl get namespaces`
- [ ] Learn how to work within a namespace

### ConfigMaps & Secrets
- [ ] Understand ConfigMaps (non-sensitive config)
- [ ] Understand Secrets (sensitive data)
- [ ] Create PostgreSQL ConfigMap
- [ ] Create PostgreSQL Secret
- [ ] Learn how to encode/decode base64 for secrets
- [ ] Verify resources exist

**Estimated Time:** 30 minutes

---

## 💾 Phase 3: Persistent Storage

- [ ] Understand PersistentVolumes (PV)
- [ ] Understand PersistentVolumeClaims (PVC)
- [ ] Understand storage classes
- [ ] Create PV for PostgreSQL
- [ ] Create PVC for PostgreSQL
- [ ] Verify PVC is bound to PV

**Estimated Time:** 20 minutes

---

## 🗄️ Phase 4: Deploy PostgreSQL

### Deployment Concepts
- [ ] Understand what a Deployment is
- [ ] Understand replica sets
- [ ] Understand pod lifecycle
- [ ] Create PostgreSQL Deployment
- [ ] Verify pod is running
- [ ] Check pod logs

### Service Concepts
- [ ] Understand Services (ClusterIP, NodePort, LoadBalancer)
- [ ] Understand how services route traffic
- [ ] Create PostgreSQL Service
- [ ] Test internal DNS resolution
- [ ] Verify service endpoints

**Estimated Time:** 45 minutes

---

## 🚀 Phase 5: Deploy Your API

### Application Deployment
- [ ] Push/load image to cluster
- [ ] Create API ConfigMap
- [ ] Create API Secret with DATABASE_URL
- [ ] Create API Deployment with 3 replicas
- [ ] Understand resource requests and limits
- [ ] Add liveness probe (health check)
- [ ] Add readiness probe
- [ ] Create API Service

### Verification
- [ ] All 3 API pods are running
- [ ] Pods can connect to PostgreSQL
- [ ] Check pod logs show no errors
- [ ] Service has endpoints

**Estimated Time:** 60 minutes

---

## 🌐 Phase 6: External Access

### Ingress
- [ ] Understand what Ingress is
- [ ] Enable Ingress controller (Minikube addon)
- [ ] Create Ingress resource
- [ ] Configure /etc/hosts for local domain
- [ ] Access API through Ingress

### Alternative Access Methods
- [ ] Use `kubectl port-forward`
- [ ] Use Minikube service command
- [ ] Understand differences between access methods

**Estimated Time:** 30 minutes

---

## 🔄 Phase 7: Database Migration

- [ ] Understand Kubernetes Jobs
- [ ] Create migration Job
- [ ] Apply migration Job
- [ ] Watch Job completion
- [ ] Verify tables created in database
- [ ] Understand Job vs CronJob

**Estimated Time:** 20 minutes

---

## 🧪 Phase 8: Testing & Debugging

### API Testing
- [ ] Create a user via API
- [ ] Login with user
- [ ] Create a todo
- [ ] List todos
- [ ] Update todo
- [ ] Delete todo

### Debugging Skills
- [ ] Use `kubectl describe` to debug pod issues
- [ ] Use `kubectl logs` to view application logs
- [ ] Use `kubectl exec` to shell into a pod
- [ ] Check Events for cluster issues
- [ ] Use port-forward to debug connections
- [ ] Understand common error messages

**Estimated Time:** 45 minutes

---

## 📈 Phase 9: Scaling & Updates

### Scaling
- [ ] Manually scale deployment (5 replicas)
- [ ] Verify load balancing across pods
- [ ] Scale down to 2 replicas
- [ ] Understand replica management

### Rolling Updates
- [ ] Build new Docker image (v1.1)
- [ ] Update deployment with new image
- [ ] Watch rolling update with `kubectl rollout status`
- [ ] Verify zero-downtime update
- [ ] Rollback to previous version
- [ ] Understand deployment strategies

**Estimated Time:** 40 minutes

---

## 🎓 Phase 10: Advanced Concepts

### Horizontal Pod Autoscaler (HPA)
- [ ] Understand HPA concept
- [ ] Install metrics-server (if needed)
- [ ] Create HPA resource
- [ ] Generate load to trigger scaling
- [ ] Watch pods scale up automatically
- [ ] Watch pods scale down

### Resource Management
- [ ] Create ResourceQuota
- [ ] Understand CPU and memory units
- [ ] Understand requests vs limits
- [ ] Test what happens when limits are exceeded

### Security
- [ ] Create NetworkPolicy
- [ ] Understand pod-to-pod communication
- [ ] Restrict traffic between services
- [ ] Test network isolation

**Estimated Time:** 90 minutes

---

## 🛠️ Phase 11: Day-2 Operations

### Monitoring
- [ ] Check resource usage with `kubectl top`
- [ ] View cluster events
- [ ] Monitor pod health over time
- [ ] Set up basic monitoring (optional: Prometheus)

### Maintenance
- [ ] Drain a node
- [ ] Cordon a node
- [ ] Perform cluster upgrade (optional)
- [ ] Backup critical data

### Troubleshooting
- [ ] Fix a CrashLoopBackOff pod
- [ ] Debug ImagePullBackOff error
- [ ] Resolve resource constraint issues
- [ ] Fix service discovery issues

**Estimated Time:** 60 minutes

---

## 🏆 Phase 12: Best Practices

- [ ] Use labels consistently
- [ ] Implement proper health checks
- [ ] Set resource requests/limits
- [ ] Use namespaces for isolation
- [ ] Externalize configuration
- [ ] Secure sensitive data
- [ ] Implement RBAC (Role-Based Access Control)
- [ ] Use Init Containers when needed
- [ ] Implement proper logging strategy
- [ ] Document your manifests

**Estimated Time:** Ongoing

---

## 🎯 Final Project Checklist

- [ ] Application runs with 3 replicas
- [ ] PostgreSQL persists data across pod restarts
- [ ] Can access API externally
- [ ] Database migrations run successfully
- [ ] All health checks passing
- [ ] Resources have appropriate limits
- [ ] ConfigMaps and Secrets used properly
- [ ] Can scale application up/down
- [ ] Can perform rolling updates
- [ ] HPA is working (optional)
- [ ] Network policies in place (optional)
- [ ] Clean documentation of setup

---

## 📚 Knowledge Validation

Can you explain these concepts?

### Beginner
- [ ] What is a Pod?
- [ ] What is a Deployment?
- [ ] What is a Service?
- [ ] Difference between ConfigMap and Secret
- [ ] What is a namespace?
- [ ] What is kubectl?

### Intermediate
- [ ] How does service discovery work?
- [ ] What are selectors and labels?
- [ ] How do health checks work?
- [ ] What is a PersistentVolume?
- [ ] How does Ingress route traffic?
- [ ] What happens during a rolling update?

### Advanced
- [ ] How does the Kubernetes scheduler work?
- [ ] What is the difference between ReplicaSet and Deployment?
- [ ] How does HPA make scaling decisions?
- [ ] What are Init Containers used for?
- [ ] How do NetworkPolicies work?
- [ ] What is a StatefulSet vs Deployment?

---

## 🎓 Next Learning Goals

After completing this checklist:

- [ ] Learn Helm (package manager)
- [ ] Study StatefulSets
- [ ] Implement service mesh (Istio/Linkerd)
- [ ] Set up CI/CD pipeline
- [ ] Deploy to cloud (EKS/GKE/AKS)
- [ ] Learn about Operators
- [ ] Study Kubernetes architecture
- [ ] Get CKA/CKAD certification

---

## 📊 Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Phase 1 | 45 min | | |
| Phase 2 | 30 min | | |
| Phase 3 | 20 min | | |
| Phase 4 | 45 min | | |
| Phase 5 | 60 min | | |
| Phase 6 | 30 min | | |
| Phase 7 | 20 min | | |
| Phase 8 | 45 min | | |
| Phase 9 | 40 min | | |
| Phase 10 | 90 min | | |
| Phase 11 | 60 min | | |
| **Total** | **6-8 hours** | | |

---

## 💡 Tips for Success

1. **Don't rush** - Take time to understand each concept
2. **Make mistakes** - Breaking things helps you learn
3. **Read error messages** - They usually tell you what's wrong
4. **Use kubectl explain** - Built-in documentation
5. **Check logs often** - They're your best debugging tool
6. **Take breaks** - Kubernetes has a steep learning curve
7. **Join communities** - Ask questions on Reddit, Discord, Slack
8. **Keep practicing** - Deploy multiple apps to reinforce learning

---

**Good luck on your Kubernetes journey!** 🚀

Remember: Every Kubernetes expert was once a beginner. You've got this! 💪

