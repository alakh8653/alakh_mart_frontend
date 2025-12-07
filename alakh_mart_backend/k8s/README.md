Kubernetes manifests for alakh_mart backend

This folder includes example deployments and services for local k8s deployment.

To apply locally (minikube / kind):

```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/deployment-web.yaml
kubectl apply -f k8s/deployment-worker.yaml
kubectl apply -f k8s/service.yaml
```

You must create secrets for `alakh-mart-secrets` containing `SECRET_KEY` and `POSTGRES_PASSWORD`.
