---
prev: /guide/1-welcome.html
next: /guide/3-running-code.html
---

# Getting Started

To learn how to use Kubernetes, we'll start up a local cluster for experimentation. When you go to production, you'll launch a cluster in a cloud such as [DigitalOcean])(https://www.digitalocean.com/products/kubernetes/), [AWS](https://www.digitalocean.com/products/kubernetes/), or [GCP](https://cloud.google.com/kubernetes-engine/).

## Install Docker

You'll want to have a copy of Docker around so you can work with containers, and you'll need it to start a Kubernetes cluster. If you don't already have Docker:

- On MacOS and Windows, install [Docker Desktop](https://www.docker.com/products/docker-desktop).
- On Linux, install [Docker Engine](https://docs.docker.com/engine/install/).
- Make sure you can run `docker --version` successfully before continuing.

## Start a Cluster

Once you have a copy of Docker running, you can use it to start a local Kubernetes cluster. Here are two tools I recommend for starting a local cluster:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) includes a Kubernetes server that you can enable in the Preferences window.
- [kind](https://kind.sigs.k8s.io/) ("Kubernetes in Docker") boots a Kubernetes cluster by running Nodes as Docker containers.

Pick one of the above and follow the instructions to start a new cluster.

Once your cluster is up and running, verify it by running `kubectl` in your terminal:

```sh
$ kubectl version

Client Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.7", GitCommit:"1dd5338295409edcfff11505e7bb246f0d325d15", GitTreeState:"clean", BuildDate:"2021-01-13T13:23:52Z", GoVersion:"go1.15.5", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.7", GitCommit:"1dd5338295409edcfff11505e7bb246f0d325d15", GitTreeState:"clean", BuildDate:"2021-01-13T13:15:20Z", GoVersion:"go1.15.5", Compiler:"gc", Platform:"linux/arm64"}
```

If you see something like `Error from server (NotFound): the server could not find the requested resource`, instead of `Server Version`, then your client isn't talking to your server properly. Try the following:

- Run `kubectl config get-contexts` to list the available cluster contexts.
- Find the context that corresponds to your newly-created cluster.
- Run `kubectl config use-context CONTEXT_NAME` to switch to a context in the list.
- Run your command again.

Once your cluster is up and running, you're ready to start using it to run code!

## What is kubectl?

Throughout this tutorial, we will use kubectl to work with our cluster.

[kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) is a command-line utility that we'll use to:

- List resources running in the cluster
- Create and delete resources
- Update existing resources with new values and configurations
- Turn YAML definitions into live cluster resources and vice versa
- Read logs from containers and run commands in containers
- Understand how our apps work inside the cluster

Let's explore the cluster a bit now.

## Explore the Cluster

Try these commands to see some details about your cluster:

```
$ kubectl get pods

No resources found in default namespace.
```

This tells us a little bit about our cluster:

- Your command ran in the `default` namespace
- There are no Pods in that namespace

Let's look for all resources in this namespace, not just Pods:

```
$ kubectl get all

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d21h
```

Great! We found a Service named `kubernetes`. Let's learn more about this Service:

```
$ kubectl describe service kubernetes

Name:              kubernetes
Namespace:         default
Labels:            component=apiserver
                   provider=kubernetes
Annotations:       <none>
Selector:          <none>
Type:              ClusterIP
IP:                10.96.0.1
Port:              https  443/TCP
TargetPort:        6443/TCP
Endpoints:         192.168.65.4:6443
Session Affinity:  None
Events:            <none>
```

If you want to learn about the identity of a resource, the most important bits are usually at the top: `component=apiserver` and `provider=kubernetes` tell you that this is a core piece of Kubernetes infrastructure called the [API Server](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/).

Finally, let's check out what resources are present in all namespaces:

```
$ kubectl get all --all-namespaces

NAMESPACE     NAME                                         READY   STATUS    RESTARTS   AGE
kube-system   pod/coredns-f9fd979d6-m5w9g                  1/1     Running   2          6d21h
kube-system   pod/coredns-f9fd979d6-twjfw                  1/1     Running   2          6d21h
kube-system   pod/etcd-docker-desktop                      1/1     Running   2          6d21h
kube-system   pod/kube-apiserver-docker-desktop            1/1     Running   3          6d21h
kube-system   pod/kube-controller-manager-docker-desktop   1/1     Running   2          6d21h
kube-system   pod/kube-proxy-4hnrl                         1/1     Running   2          6d21h
kube-system   pod/kube-scheduler-docker-desktop            1/1     Running   2          6d21h
kube-system   pod/storage-provisioner                      1/1     Running   38         6d21h
kube-system   pod/vpnkit-controller                        1/1     Running   2          6d21h

NAMESPACE     NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
default       service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP                  6d21h
kube-system   service/kube-dns     ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   6d21h

NAMESPACE     NAME                        DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
kube-system   daemonset.apps/kube-proxy   1         1         1       1            1           kubernetes.io/os=linux   6d21h

NAMESPACE     NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
kube-system   deployment.apps/coredns   2/2     2            2           6d21h

NAMESPACE     NAME                                DESIRED   CURRENT   READY   AGE
kube-system   replicaset.apps/coredns-f9fd979d6   2         2         2       6d21h
```

Neat – that's a list of all the cluster infrastructure that Docker Desktop used to set up my cluster.

In the next section, we'll run our own code in this cluster by creating our own resources.
