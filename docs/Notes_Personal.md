1. Each environment should eventually have the same Terraform file structure.

Example:Directory For Terraform using Module Concetp.

dev/
├── main.tf
├── provider.tf
├── variables.tf
└── terraform.tfvars

qa/
├── main.tf
├── provider.tf
├── variables.tf
└── terraform.tfvars

stg/
├── main.tf
├── provider.tf
├── variables.tf
└── terraform.tfvars

prod/
├── main.tf
├── provider.tf
├── variables.tf
└── terraform.tfvars

Why Same Structure?

Because:

code consistency
easier maintenance
predictable deployments
enterprise standardization
================================================================================
# 2. Commands to use it very usefull
- Run this command to format all .TF file in root Directory Level:
  PS D:\terraform\azure-terraform\aksterraform> terraform fmt -recursive
- Can use the target env wise to create resource in spcific enviornment.
    terraform plan -var-file="envs/dev.tfvars"
    terraform apply -var-file="envs/dev.tfvars"
================================================================================
# 3 after careate the AKS then check the 
    az aks list -o table
    Get credentials:
    az aks get-credentials --resource-group rg-aks-dev-sdp --name <your-aks-name>
    az aks get-credentials --resource-group rg-aks-dev-sdp --name testAKSClusterJun-26
# 
    kubectl config current-context
    kubectl get nodes
    kubectl cluster-info
    kubectl get all -A
# Deployment 
    kubectl create deployment nginx --image=nginx
    kubectl get deployments
    kubectl get pod
    kubectl expose deployment nginx --port=80 --type=LoadBalancer
    kubectl get svc
# Kubernetes Dashboard, Run this Command in that will run in background
    Start-Job -ScriptBlock { kubectl proxy }
-   Use Port Forward Instead (Recommended for Dashboard), For newer Kubernetes Dashboard versions, use:
# Next steps:  Recommended next AKS learning path
    Deploy NGINX
    Namespaces
    ConfigMaps
    Secrets
    Liveness & Readiness Probes
    Persistent Volumes
    Ingress Controller
    Deploy your React + Node.js application
    ACR integration
    CI/CD with Azure DevOps or GitHub Actions
# Validation after Deplyment:
    kubectl describe svc nginx
    kubectl describe service nginx

# A Service of type LoadBalancer creates an Azure Load Balancer:.
    Note: "When I created a Kubernetes Service of type LoadBalancer on AKS, Azure automatically provisioned an Azure Standard Load Balancer. The public IP was attached to the Azure Load Balancer, which forwarded traffic to the AKS nodes and then to the Kubernetes Service and pods.
    ALB and NLB are AWS-specific services. In AKS, the equivalent service created by a Kubernetes LoadBalancer Service is an Azure Standard Load Balancer, which operates primarily at Layer 4 (TCP/UDP).

 # The next valuable exercise would be:
    Terraform
    ↓
    AKS
    ↓
    ACR
    ↓
        Docker Image
    ↓
    Kubernetes Deployment
    ↓
    LoadBalancer Service

# Step 1: Learn Namespaces, To logically separate environments such as dev, qa, and prod within the same cluster.
    kubectl create namespace dev
    Deploy NGINX into it:
    kubectl create deployment nginx --image=nginx -n dev
    kubectl get all -n dev

# Step 2: Learn ConfigMaps, Instead of hardcoding configuration values.
    kubectl apply -f configmap.yaml
    List ConfigMaps in the namespace:
    kubectl apply -f configmap.yaml -n dev
# View the ConfigMap details
    kubectl describe configmap app-config -n dev
# Remove the Configmap from default namespace
    kubectl delete configmap app-config -n default
# Check the configmap in namespace
    kubectl get cm -n dev

# Describe the kube-root-ca.crt file
    kubectl describe configmap kube-root-ca.crt
    kubectl get configmap kube-root-ca.crt -o yaml

# Count objects in your cluster: You can get a quick inventory:

    kubectl get pods -A
    kubectl get svc -A
    kubectl get deployments -A
    kubectl get configmaps -A
    kubectl get secrets -A
    -Everything returned by these commands is backed by data stored in etcd.

# Change the Temerrory Name of the Pod Like:
    kubectl exec -it mysql-7c84b65c95-876w9 -n dev -- /bin/bash
    bash-5.1# export PS1='[root@MySqlContainerPod:]' 
    [root@MySqlContainerPod:]
# Namespaces
    kubectl get namespaces
    kubectl get ns
# Set a namespace as the default for your current context
    kubectl config set-context --current --namespace=dev
    kubectl config view --minify --output 'jsonpath={..namespace}'
    # Then you no longer need to type -n dev for every command. will automatically run against the dev namespace.

# In Azure:
Azure Standard Load Balancer = Layer 4 (TCP/UDP)
Azure Application Gateway = Layer 7 (HTTP/HTTPS), similar in purpose to an AWS Application Load Balancer (ALB)

It supports:

✅ Path-based routing (/api, /app)
✅ Host-based routing (api.company.com, app.company.com)
✅ SSL/TLS termination
✅ WAF
"If I want a simple external endpoint, I use a Service of type LoadBalancer, which uses an Azure Standard Load Balancer. If I want host-based or path-based routing, SSL termination, or WAF, I use Azure Application Gateway with AGIC. In that case, my Services are usually ClusterIP and I create a separate Ingress YAML containing the routing rules.


# Create a Configmap
    kubectl create configmap app-config --from-literal=ENV=dev --from-literal=APP_NAME=nginx
    kubectl describe configmap app-config
# Create a Secret
    kubectl create secret generic app-secret --from-literal=username=admin --from-literal=password=Password123
    kubectl get secrets
    kubectl describe secret app-secret
    kubectl create secret generic app-secret --from-literal=username=admin --from-literal=password=Password123 -n dev
# Export the any Deployment YAML file:
    kubectl get deployment nginx -n dev -o yaml > nginx-deployment.yaml
# Validate YAML file always before Deploy:
    kubectl apply --dry-run=client -f nginx-deployment.yaml
# Then apply the Real Deplyment:
    kubectl apply -f nginx-deployment.yaml
# After Deplyment rollout check the Roleout:
    kubectl rollout status deployment/nginx -n dev

# Action take for Configmap and env value injected into pod:
ConfigMap (app-config)
├── ENV=dev
└── APP_NAME=nginx-app
Secret (app-secret)
├── username=admin
└── password=Password123
        │
        ▼
Deployment
(env section with configMapKeyRef & secretKeyRef)
        │
        ▼
Pod Created by Deployment
        │
        ▼
Container Environment Variables    

# Check the deplment secrete and confimap valued
    kubectl exec -it nginx-6fc99dbcf5-vmw2c -n dev -- printenv
    What you have accomplished:
    ConfigMap
        │
        ▼
    Deployment
        │
        ▼
    Pod Created
        │
        ▼
    Environment Variables Injected
        │
        ▼
    Verified Inside Container ✓

# Go to Inside Container/Pod 
    kubectl exec -it nginx-6fc99dbcf5-vmw2c -n dev -- /bin/bash
    root@nginx-6fc99dbcf5-vmw2c:/# exit
    exit
    kubectl exec -it nginx-6fc99dbcf5-vmw2c -n dev -- /bin/sh  
    printenv
# Mount ConfigMap as File in Pod
You have now successfully completed:

    ✅ Deployment
    ✅ ConfigMap as Environment Variables
    ✅ Secret as Environment Variables
    ✅ ConfigMap mounted as Volume
    ✅ Verification inside the container

# Phase 3: Volumes and Persistent Storage
    - ✔ YES — Phase 3 is correct
    ❗ BUT first finish:
    👉 ConfigMap/Secret as Mounted Files
    THEN:
    👉 Persistent Volume & PVC (Phase 3)
1. PV (Persistent Volume) is the actual storage/disk used by Kubernetes.
   In AKS it is typically an Azure Managed Disk or Azure Files share.
   The PV is usually created dynamically when a PVC is created.

2. PVC (PersistentVolumeClaim) is a request for storage.
   Example:
   "I need 20Gi storage."

3. Kubernetes binds:
   Pod → PVC → PV → Azure Disk

4. A single MySQL instance can store multiple databases using the same PVC.
   Example:
   k8sdemo
   employee
   sales
   inventory

5. If you want to increase storage from 5Gi to 20Gi,
   you usually edit the existing PVC and apply the change.
   Kubernetes expands the existing PV (if the StorageClass supports expansion).
   It does NOT create or mount a brand-new PVC.

6. For separate environments (Dev, QA, Staging, Prod),
   you should have separate resources:

   mysql-dev-secret
   mysql-dev-pvc
   mysql-dev-deployment

   mysql-qa-secret
   mysql-qa-pvc
   mysql-qa-deployment

   mysql-prod-secret
   mysql-prod-pvc
   mysql-prod-deployment

7. PVC provides persistence, but it is NOT a backup.
   Production environments still require backup and restore strategies.

8. To resize the PVC, update the storage size in mysql-pvc.yaml and run:
    kubectl apply -f mysql-pvc.yaml -n dev
    The PVC will be expanded, and the running pod will use the increased storage capacity. If the new size is not visible inside the container, restart the pod.

# So Far I have completed thse points on 10-Jun-2026
Kubernetes Concepts You've Completed
    Core Objects:
    ✅ Namespace
    ✅ Deployment
    ✅ ReplicaSet
    ✅ Pod
    Configuration:
    ✅ ConfigMap (Environment Variables)
    ✅ ConfigMap (Volume Mount)

    Security:
    ✅ Secret (Environment Variables)

    Storage:
    ✅ PersistentVolumeClaim (PVC)
    ✅ PersistentVolume (PV)
    ✅ Azure Managed Disk CSI Driver
    ✅ Volume Mounts
    ✅ Data Persistence Verification

    Operations:
    ✅ kubectl exec
    ✅ kubectl logs
    ✅ kubectl describe
    ✅ Rollout Updates

# Phase 4: Kubernetes Networking
    ✅ Deployment
    ✅ ConfigMap
    ✅ Secrets
    ✅ ConfigMap Volume
    ✅ PVC (Azure Disk)
    ✅ Persistent Storage
    ✅ ClusterIP Service

# Learned So Far
| Topic              | Status |
| ------------------ | ------ |
| Namespace          | ✅     |
| Deployment         | ✅     |
| ReplicaSet         | ✅     |
| Pod                | ✅     |
| ConfigMap (Env)    | ✅     |
| Secret (Env)       | ✅     |
| ConfigMap Volume   | ✅     |
| PVC                | ✅     |
| Azure Disk         | ✅     |
| Persistent Storage | ✅     |
| ClusterIP Service  | ✅     |
| Internal DNS       | ✅     |
| Liveness Probe     | ✅     |
| Readiness Probe    | ✅     |
| LoadBalancer Service    | ✅|

# Phase 1–6 (You already completed)
✔ Pods → Deployments
✔ Services (ClusterIP, LoadBalancer)
✔ ConfigMaps, Secrets
✔ PVC + Azure Disk
✔ Probes (Liveness/Readiness)
✔ Namespaces

✅ Pods
✅ ReplicaSets
✅ Deployments
✅ Namespaces
✅ ConfigMaps
✅ Secrets
✅ PVCs
✅ Azure Disk, mounted
✅ Persistent Storage
✅ ClusterIP Service
✅ LoadBalancer Service
✅ Internal DNS
✅ Liveness Probes
✅ Readiness Probes
# Liveness probe checks if the container is running correctly and restarts it if it fails.
# Readiness probe checks if the container is ready to accept traffic and removes it from service endpoints if it fails.
# ################################################################################
# ################################################################################
# 🔐 1. RBAC (Role-Based Access Control)
🎯 FINAL REAL-WORLD LEARNING PATH (SIMPLE FLOW)
CORE K8s (you completed)
↓
Traffic + Updates + Resources
↓
Ingress + Scaling
↓
Workloads (Jobs / StatefulSets)
↓
Security (RBAC + Network Policies)
↓
Monitoring (Prometheus + Grafana)
↓
Helm
↓
CI/CD to AKS
↓
GitOps (Argo CD)
↓
Advanced production patterns
↓
Mini project (end-to-end system)

# Install Ingress viay manual manifast, Without Helm (Manual YAML)
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
# Check if Ingress Controller is running
    kubectl get pods -n ingress-nginx

# Deploy 2 sample apps
    app1 (nginx)
    app2 (httpd)
👉 You can expose 10, 20, or 100+ applications using a single public IP.
Example: 4 applications using SAME IP
🟢 Example: 4 applications using SAME IP
Suppose you add:
    app1 → nginx
    app2 → httpd
    app3 → nodejs
    app4 → python flask
🧠 All use SAME structure:
Each app needs only:
    ✔ Deployment
    ✔ ClusterIP Service
# All apps still use:
    http://4.188.2.220/app1
    http://4.188.2.220/app2
    http://4.188.2.220/app3
    http://4.188.2.220/app4
# Kubernetes Ingress mainly supports two common routing policies:
👉 Path-Based Routing: Routing is based on the URL path
    http://4.188.2.220/app1 → service A
    http://4.188.2.220/app2 → service B
👉 Host-Based Routing (next level): Routing is based on domain name (host header)
    app1.company.com → service A
    app2.company.com → service B
# Note: 
    Kubernetes Ingress provides Layer 7 routing using host-based and path-based rules to expose multiple services through a single LoadBalancer IP, reducing cost and simplifying traffic management.
    Ingress provides Layer-7 routing and allows multiple Kubernetes services to be exposed through a single LoadBalancer IP using path-based or host-based routing. The Ingress routes traffic to backend Services, which then forward requests to Pods.
# Host-based Ingress routing in AKS


👉 Phase 5 — Workload Management
    1. Rolling Updates & Rollbacks
    🎯 Objective:
        Learn:

        ✅ Rolling Update
        ✅ Deployment History
        ✅ Rollout Status
        ✅ Rollback
        ✅ Zero-Downtime Deployment
# What Rolling Updates Cover
    Updating container images without downtime
    Gradually replacing old Pods with new Pods
    Monitoring deployment progress

# What is a Rollout?
    A rollout is the process of deploying a new version of an application in Kubernetes.
    kubectl apply -f nginx-deployment.yaml
    kubectl set image deployment/nginx nginx=nginx:1.28
    Both trigger a rollout.
    A rollout is the process of deploying changes to a Kubernetes Deployment. When the Deployment specification changes, Kubernetes creates a new ReplicaSet and updates Pods according to the configured deployment strategy.
# What is RollingUpdate?
    RollingUpdate is the default deployment strategy in Kubernetes.
    It updates Pods gradually without bringing down the entire application.
    RollingUpdate is the default Kubernetes deployment strategy that gradually replaces old Pods with new Pods while keeping the application available.
# What is Recreate Strategy?
    Recreate removes all old Pods before creating new Pods.

    kubectl rollout status deployment/nginx
    kubectl rollout history deployment/nginx
    kubectl rollout undo deployment/nginx
    kubectl describe deployment nginx
    kubectl get rs
    kubectl set image deployment/nginx nginx=nginx:1.28
    kubectl apply -f deployment.yaml
Note: A Deployment creates new Pods whenever the Pod Template (spec.template) changes. Kubernetes creates a new ReplicaSet and performs a rollout according to the deployment strategy (usually RollingUpdate).

# Q: Why can RollingUpdate fail with Persistent Volumes?

# A: When a Deployment uses a ReadWriteOnce volume (such as Azure Disk), the same volume cannot be attached to multiple Pods simultaneously. During a RollingUpdate, the old Pod still holds the volume, preventing the new Pod from attaching it, resulting in a Multi-Attach error.

# Phase 6 — Storage & Stateful Workloads (1 Week)
Objectives

Learn how applications persist data.

Topics:
✅ Persistent Volumes (PV)
✅ Persistent Volume Claims (PVC)
✅ Storage Classes
✅ Azure Disk CSI Driver
✅ Azure File Share CSI Driver
✅ StatefulSets
Hands-on Labs
    Create a PVC
    Mount PVC to NGINX pod
    Delete pod and verify data persists
    Deploy MySQL using PVC
    Deploy PostgreSQL using StatefulSet
    Backup and restore data
Commands:
    kubectl get pv
    kubectl get pvc
    kubectl get storageclass
    kubectl get statefulset
# Phase 7 — Scheduling & Resource Management (1 Week)
Objectives:
Understand how Kubernetes decides where pods run.

Topics:

✅ Resource Requests
✅ Resource Limits
✅ QoS Classes
✅ Node Selectors
✅ Node Affinity
✅ Pod Affinity
✅ Pod Anti-Affinity
✅ Taints & Tolerations

Hands-on Labs
    Create CPU/Memory limits
    Trigger OOMKilled pod
    Deploy workload to specific node
    Prevent two pods running on same node
Commands
    kubectl top pods
    kubectl top nodes
    kubectl describe pod
# Phase 8 — Autoscaling (1 Week)
Objectives:
Automatically scale applications.
Topics:
✅ Metrics Server
✅ Horizontal Pod Autoscaler (HPA)
✅ Vertical Pod Autoscaler (Concept)
✅ Cluster Autoscaler
✅ AKS Node Pool Scaling

Hands-on Labs:
    Install Metrics Server
    Configure HPA
    Generate load
    Watch pods scale automatically
    Enable AKS Cluster Autoscaler
Commands:
    kubectl autoscale deployment
    kubectl get hpa

Phase 9 — Security (2 Weeks)
Objectives:
Learn production security.

Topics:
✅ Service Accounts
✅ RBAC
✅ Roles
✅ RoleBindings
✅ ClusterRoles
✅ ClusterRoleBindings
✅ Network Policies
✅ Image Security
✅ Secrets Best Practices
Advanced:
✅ Azure Key Vault
✅ Secrets Store CSI Driver

Hands-on Labs
    Create namespace-specific RBAC
    Restrict user access
    Create Network Policies
    Integrate Azure Key Vault

Phase 10 — Production Networking (1 Week)
Objectives

Master AKS networking.:
Topics:
✅ Ingress
✅ NGINX Ingress Controller
✅ TLS Certificates
✅ Cert Manager
✅ Let's Encrypt
✅ Azure DNS
✅ ExternalDNS
Hands-on Labs
Create multiple host-based routes
    app1.local
    app2.local
    api.local
    Configure HTTPS
    Automatic certificate renewal
    DNS integration
    This is where your current Ingress knowledge fits.

# Phase 11 — Monitoring & Observability (2 Weeks)
Objectives:
Monitor production workloads.
Topics
✅ Metrics
✅ Logs
✅ Traces
Tools:
✅ Prometheus
✅ Grafana
✅ Azure Monitor
✅ Log Analytics
✅ Fluent Bit

Hands-on Labs
    Install Prometheus
    Create Grafana dashboards
    Configure alerts
    View container logs
    Create CPU/Memory alerts

# Phase 12 — GitOps (1 Week)
Objectives:
Modern Kubernetes deployment.
Topics:
✅ GitOps
✅ ArgoCD
✅ FluxCD
Hands-on Labs
    Install ArgoCD
    Connect Git Repository
    Automatic AKS deployments
This is increasingly common in production.

Phase 13 — CI/CD for AKS (1 Week)
This aligns with your DevOps background.

Topics
✅ Azure DevOps
✅ ACR
✅ AKS Deployment Automation
Pipeline Flow
    Git Push
        ↓
    Build
        ↓
    Docker Image
        ↓
    ACR
        ↓
    AKS Deployment
    Hands-on Labs
    Build React App
    Build Node.js API
    Push to ACR
    Deploy to AKS automatically
# Phase 14 — Production Project (2–3 Weeks)

Build a complete application:
React Frontend
       ↓
Node.js Backend
       ↓
MySQL/PostgreSQL
       ↓
AKS
       ↓
Ingress
       ↓
TLS
       ↓
HPA
       ↓
Prometheus
       ↓
Grafana
       ↓
Azure DevOps CI/CD
Features

✅ Persistent Storage

✅ Secrets

✅ Ingress

✅ HTTPS

✅ Autoscaling

✅ Monitoring

✅ CI/CD

Interview-Ready Advanced Topics

After the above:

Helm
Kustomize
Service Mesh (Istio)
Multi-Cluster AKS
Azure CNI vs Kubenet
AKS Upgrade Strategy
Disaster Recovery
Backup & Restore
Velero
Cost Optimization
Security Scanning
Gatekeeper / OPA
AIOps on Kubernetes

Given your goals (AKS + DevOps + AIOps), your next immediate phase should be:

Phase 6 → Storage & Stateful Workloads (PV, PVC, StorageClass, Azure Files, StatefulSets)

After that, move to Phase 8 Autoscaling, then Phase 9 Security, then Phase 11 Monitoring, because those are the areas most commonly encountered in real AKS production environments.

# What separates "Advanced" from "Expert"

After the roadmap, focus on operating Kubernetes in real scenarios:
Cluster Troubleshooting
Examples:
    Pods stuck in Pending
    CrashLoopBackOff
    ImagePullBackOff
    OOMKilled
    Node NotReady
    Failed scheduling

You should be able to diagnose these quickly.
AKS Operations
Learn:
    AKS upgrades
    Node pool upgrades
    Backup & restore
    Disaster recovery
    Cost optimization
    Multi-node pool strategies


    PHASE 1 – CLUSTER CREATION & ACCESS
Commands:
	az aks list -o table
	az aks get-credentials --resource-group rg-aks-dev-sdp --name <cluster>

	kubectl config current-context
	kubectl cluster-info
	kubectl get nodes
	kubectl get all -A
================================================================================
PHASE 2 – CORE KUBERNETES OBJECTS
Topics:
	Namespaces
	Pods
	ReplicaSets
	Deployments
	Services

Commands:
	kubectl create namespace dev
	kubectl get ns

	kubectl create deployment nginx --image=nginx -n dev
	kubectl get deploy -n dev
	kubectl get pods -n dev

	kubectl expose deployment nginx --port=80 --type=LoadBalancer
	kubectl get svc
================================================================================
PHASE 3 – CONFIGURATION MANAGEMENT
Topics:
	ConfigMaps
	Secrets
	Environment Variables

Commands:
	kubectl create configmap app-config --from-literal=ENV=dev

	kubectl create secret generic app-secret --from-literal=username=admin --from-literal=password=Password123

	kubectl get cm
	kubectl get secrets

	kubectl describe configmap app-config
	kubectl describe secret app-secret

================================================================================
PHASE 4 – STORAGE
Topics:
	PV
	PVC
	Azure Disk CSI Driver

Commands:
	kubectl get pv
	kubectl get pvc

	kubectl describe pvc <pvc-name>
================================================================================
PHASE 5 – HEALTH CHECKS
Topics:
	Liveness Probe
	Readiness Probe

Commands:
	kubectl describe pod <pod-name>
	kubectl get events

================================================================================
PHASE 6 – NETWORKING
Topics:
	ClusterIP
	LoadBalancer
	Internal DNS

Commands:
	kubectl get svc
	kubectl describe svc <service>

	kubectl exec -it <pod> -- nslookup <service-name>

================================================================================
PHASE 7 – INGRESS CONTROLLER (NEXT)
Purpose:
	Layer-7 Routing

Learn:
	Ingress
	NGINX Ingress Controller
	Azure Application Gateway Ingress Controller (AGIC)

Commands:
	kubectl get ingress
	kubectl apply -f ingress.yaml
	kubectl describe ingress

================================================================================
PHASE 8 – HELM PACKAGE MANAGEMENT
Purpose:
Deploy production applications quickly.

Commands:
	helm repo add bitnami https://charts.bitnami.com/bitnami
	helm repo update
	helm search repo nginx
	helm install nginx bitnami/nginx
	helm list
	helm upgrade nginx bitnami/nginx
	helm uninstall nginx
================================================================================
PHASE 9 – APPLICATION DEPLOYMENT
Purpose:
	Deploy real-world applications.

Topics:
	Frontend
	Backend
	Multi-tier apps

Commands:
	kubectl apply -f deployment.yaml
	kubectl apply -f service.yaml
	kubectl rollout status deployment/app
	kubectl rollout history deployment/app
	kubectl rollout undo deployment/app
================================================================================

PHASE 10 – CONTAINER REGISTRY
Purpose:
	Store Docker images.

Topics:
	ACR
	ECR

Commands:
	az acr login --name <acr>
	docker build -t app:v1 .
	docker tag app:v1 <acr>.azurecr.io/app:v1
	docker push <acr>.azurecr.io/app:v1
================================================================================
PHASE 11 – CI/CD PIPELINES
Purpose:
	Automated deployments.

Topics:
	Azure DevOps
	GitHub Actions
Validation Commands:
	kubectl get deploy
	kubectl rollout status deployment/app
	kubectl get pods
================================================================================
PHASE 12 – OBSERVABILITY & MONITORING
Purpose:
	Monitor cluster health.

Tools:
	Prometheus
	Grafana
	Azure Monitor
	Container Insights

Commands:
	kubectl top nodes
	kubectl top pods
	kubectl get events --sort-by=.metadata.creationTimestamp
	kubectl logs <pod>
	kubectl logs -f <pod>
================================================================================
PHASE 13 – TROUBLESHOOTING
Purpose:
	Handle production incidents.

Commands:
	kubectl get pods -A
	kubectl describe pod <pod>
	kubectl logs <pod>
	kubectl logs -f <pod>
	kubectl exec -it <pod> -- /bin/sh
	kubectl get events
	kubectl get endpoints
	kubectl describe svc <svc>
	kubectl get ingress
	kubectl describe ingress
================================================================================
PHASE 14 – SECURITY
Purpose:
	Secure Kubernetes workloads.

Topics:
	RBAC
	Service Accounts
	Network Policies
	Pod Security

Commands:
	kubectl auth can-i '*' '*'
	kubectl get sa
	kubectl get roles
	kubectl get rolebindings
	kubectl get clusterroles
	kubectl get clusterrolebindings
================================================================================
PHASE 15 – SCALING & HIGH AVAILABILITY
Purpose:
	Production readiness.

Commands:
	kubectl scale deployment nginx --replicas=5
	kubectl get hpa
	kubectl autoscale deployment nginx --cpu-percent=70 --min=2 --max=10
================================================================================
PHASE 16 – BACKUP & DISASTER RECOVERY

Commands:
	kubectl get all -A -o yaml > cluster-backup.yaml
	etcdctl snapshot save backup.db
================================================================================
PHASE 17 – ADVANCED OPERATIONS

Topics:
	DaemonSets
	StatefulSets
	Jobs
	CronJobs

Commands:
	kubectl get daemonsets
	kubectl get statefulsets
	kubectl get jobs
	kubectl get cronjobs
================================================================================
PHASE 18 – PRODUCTION DEVOPS ENGINEER LEVEL
You should be able to:
1. Create AKS/EKS using Terraform
2. Configure ACR/ECR
3. Build Docker Images
4. Configure CI/CD Pipelines
5. Deploy Applications
6. Configure Ingress
7. Implement Monitoring
8. Troubleshoot Pods, Services, Ingress
9. Implement RBAC
10. Handle Production Incidents
11. Scale Applications
12. Perform Cluster Upgrades
13. Implement Backup & DR
14. Secure Workloads
15. Lead Kubernetes Production Operations


======================================================
1. Networking (very important)
Services (ClusterIP, NodePort, LoadBalancer)
Ingress + Ingress Controller
DNS inside cluster
Network policies
======================================================
2. Storage (you just started this)
PV vs PVC deep understanding
StorageClasses
StatefulSets (VERY important)
Azure Files vs Azure Disk
======================================================
3. Scaling & performance
HPA (you are about to learn this)
VPA (Vertical scaling)
Cluster Autoscaler
======================================================
4. Production readiness
Zero downtime deployments
Blue/Green deployment
Canary deployment
Rollback strategies
======================================================
5. Observability
Metrics Server
Prometheus + Grafana
Logs (ELK / Loki)
Alerts
======================================================
6. Security (advanced)
RBAC
Service Accounts
Secrets encryption
Pod Security Standards
======================================================
7. Real DevOps integration
CI/CD pipelines (Azure DevOps / GitHub Actions)
Helm charts
GitOps (ArgoCD / Flux)
============================================================================================================
When you're practicing raw Kubernetes: Deployment
For learning purposes, I recommend this workflow
I
✅Part 1 – Learn using raw Kubernetes (main)

When you're practicing raw Kubernetes:
Switch to main Branch:
PS D:\terraform\azure-terraform\aksterraform\qa\project> git branch
  helm-deploy
* main
Remove the Helm release: 
PS D:\terraform\azure-terraform\aksterraform\qa\project> helm uninstall myapp -n qa
Then Deploy everything from your Kubernetes manifests:
PS D:\terraform\azure-terraform\aksterraform\qa\project> kubectl apply -f .

✅Part 2 – Learn using Helm (helm-deploy)
When you're practicing Helm:

Switch to helm-deploy branch:
Deploy with:
PS D:\terraform\azure-terraform\aksterraform\qa\project\qa-app\templates> helm upgrade --install myapp ./qa-app -n qa
✅ This will give you a clean understanding of both deployment styles.
============================================================================================================
Check the full YAML file has in the path or Dir:
PS D:\terraform\azure-terraform\aksterraform\qa\project> Get-ChildItem -Recurse *.yaml | Select-Object FullName