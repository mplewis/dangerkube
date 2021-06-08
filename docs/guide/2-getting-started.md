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

## Start a cluster

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

If you see something like `Error from server (NotFound): the server could not find the requested resource`, then your client isn't talking to your server properly. Try running `kubectl config get-contexts` to list the available cluster contexts, then `kubectl config use-context SOME-CONTEXT-NAME` to switch to a context in the list.
