# Running Code

In this section, we will:

- Learn about the abstractions Kubernetes uses to run lots of pods at once
- Start a little demo application called [podinfo](https://github.com/stefanprodan/podinfo)
- Start a shell inside the deployed app and play around with it
- Scale the app up and down
- Deploy a new version of the app

Kubernetes runs code in the form of **containers** using **images** as the starting point. So thoroughout this section, we'll be talking about containers and images a lot.

::: tip What's a container?
A [container](https://www.docker.com/resources/what-container) is a form of packaging code so that you can run it in the same way on lots of different systems. A container is mostly the same thing as a **Docker container** – you can consider them to be the same for now.
:::

::: tip What's an image?
An image is a snapshot of a container, ready to run, but without any state. Think of an image as a container that's never been started. We use this image as a "template," make a copy of it, and call the copy a container.
:::

While this section focuses on running ready-built Docker containers inside a Kubernetes cluster, you may find value in learning the following so you can build and deploy your own app:

- Pull an image from [Docker Hub](https://hub.docker.com/)
- Run a Docker image locally
- Package a project into a tagged Docker image using `docker build` with a `Dockerfile`
- Push a tagged Docker image to a registry

If you're interested in learning more Docker skills, check out these resources:

- [Official Docker 101 Tutorial](https://www.docker.com/101-tutorial): An interactive tutorial that you can run in Docker locally or in a ready-to-go cloud environment
- [Docker Curriculum](https://docker-curriculum.com/): A straightforward tutorial that covers building your first Docker app and putting it online via AWS Elastic Container Service

OK, let's get started!

## Introducing the podinfo app

[Podinfo](https://github.com/stefanprodan/podinfo) is a Hello World-style application. It displays a cute logo, shows some stats about the system on which it's running, and lets you ping it to show that it's answering web requests in realtime.

We will deploy this podinfo app to your cluster. If you want to try it locally, you can run:

```sh
docker run -it -p 9898:9898 stefanprodan/podinfo
```

Then visit http://localhost:9898 to see the cuttlefish:

![podinfo cuttlefish](./podinfo.png)

## Pods

When Kubernetes needs to run a container, it packages one or more containers into a **Pod**. The [Kubernetes docs](https://kubernetes.io/docs/concepts/workloads/pods/) suggest that you can think of a Pod "as in a pod of whales or a pea pod."

In this section, we will only run one container in each Pod. In the field, you might see multiple containers in the same Pod.

::: details Why would I want to run multiple containers in one Pod?
When containers share a Pod, they:

- **share** network resources
- can **share** filesystem mounts, allowing them to use the same directories cooperatively
- **do not** share CPU quotas
- **do not** share memory quotas

In a Pod with multiple containers, an auxiliary container often provides one of the following features to an app container:

- authenticated database access
- some kind of frontend, such as an nginx webserver or proxy
- log forwarding
- metric capturing
  :::

A Pod's job is to make sure that its containers start up and stay up. If a container crashes, the Pod is responsible for restarting it. But a Pod only knows about each of its container instances, and a Pod can't be split among Nodes of your cluster.

If you only run one Pod for your app, and the pod is running on a Node, and that Node crashes, your app goes offline.

## Let's Run a Pod

We're going to build the YAML for a Pod by hand and run this Pod in your cluster.

Save this into a file called `pod.yaml`:

@[code](./pod.yaml)

Then apply it using kubectl:

```
$ kubectl apply -f pod.yaml

pod/my-podinfo created
```

Finally, check the status of your cluster:

```
$ kubectl get pods

NAME         READY   STATUS    RESTARTS   AGE
my-podinfo   1/1     Running   0          10s
```

Great! You've created a pod named `my-podinfo`. Let's inspect it more closely with `kubectl describe`, a tool you can use to get detailed information about almost any resource:

```
$ kubectl describe pod my-podinfo

Name:         my-podinfo
Namespace:    default
Priority:     0
Node:         docker-desktop/192.168.65.4
Start Time:   Wed, 02 Jun 2021 20:08:46 -0600
Labels:       <none>
Annotations:  <none>
Status:       Running
IP:           10.1.0.10
IPs:
  IP:  10.1.0.10
Containers:
  my-container:
    Container ID:   docker://1b9fa18cb68e79493f8d6db4ed53fc141fb08a10bde5a1794d8312597966b9dd
    Image:          stefanprodan/podinfo:latest
    Image ID:       docker-pullable://stefanprodan/podinfo@sha256:119b9b2db4e0e604b96f95976b85b120bc88a104cd908d7a8874d356e6067a4b
    Port:           9898/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Wed, 02 Jun 2021 20:08:49 -0600
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-zgsgh (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  default-token-zgsgh:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-zgsgh
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                 node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  19s   default-scheduler  Successfully assigned default/my-podinfo to docker-desktop
  Normal  Pulling    17s   kubelet            Pulling image "stefanprodan/podinfo:latest"
  Normal  Pulled     16s   kubelet            Successfully pulled image "stefanprodan/podinfo:latest" in 930.767834ms
  Normal  Created    16s   kubelet            Created container my-container
  Normal  Started    16s   kubelet            Started container my-container
```

OK, that's a lot of info. What does it mean? Let's go over it from top to bottom, skipping the parts that don't matter much right now.

- **Name:** This pod is named `my-podinfo`, just like you wrote in your YAML spec.
- **Namespace:** Every resource in Kubernetes lives in a [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/). Resources in different namespaces are usually isolated from one another. Since you didn't specify a namespace in your Pod spec, your Pod was created in the `default` namespace.
- **Labels**: Labels are a way to tag resources so that other pieces of cluster infrastructure can understand them. For example, you might add a Label to a Pod such as `example.com/log-aggregation: enabled`, and this might tell tell another piece of infrastructure to capture this Pod's logs and send them to your third-party logging system.
- **Annotations:** Annotations are a way to tag resources so that humans can understand them. For example, you might have a Deployment, a Service, and an Ingress for one of your applications, and you might add a Label to each one such as `app: my-cool-web-service` so that you can query for all resources that belong to `my-cool-web-service`.
- **IP:** Each Pod on a Node has an IP address. This is a private IP inside the cluster network, and you can use it to talk to this Pod from other Pods inside the cluster. But it's easier to use a Service to talk to your Pods. We'll discuss Services in a future section.
- **Containers:** This describes each container in your pod, what image it's running, its current state, and how many times it's restarted since you started this pod. Containers restart when they exit or crash, so if the restart count is high, your container might be crashing a lot.
- **Conditions:** These describe the current state of your Pod and help you understand when something is going wrong.
- **Volumes:** These allow you to mount data into your Pod from an external source, such as a ConfigMap or Secret. We'll discuss Volumes in a future section.
- **Events:** These act as a timeline to show what happened with your Pod, from when your pod is scheduled onto a Node until the containers start successfully. If your Pod's containers are crashing and rebooting, the Events section is where you will usually learn about it.

## ReplicaSets

A **ReplicaSet** acts as a supervisor to ensure Pods are online and working properly. Its responsibility is to ensure the Pod you specified is running and your Pod has the right number of **replicas** online.

If you start a Pod on its own, Kubernetes might destroy your Pod in the case of a Node crash or a disruptive Node upgrade. So we don't run Pods on their own for real apps. We use ReplicaSets, which are durable, to manage Pods, which are sort of transient.

Generally, we don't manage ReplicaSets directly. We use Deployments to manage ReplicaSets which manage our Pods. We tell you about ReplicaSets here because you'll see them used when you start working with Deployments.

## Deployments

A **Deployment** manages ReplicaSets in a declarative way:

- When you need **more or less Pods**, you change the replica count in the Deployment spec. The Deployment updates the underlying ReplicaSet's replica count for you.
- When you need a **different image** running in your Pod, you change the Pod spec in the Deployment spec. The Deployment performs a **rollout** to create a new ReplicaSet and pods, and destroy the old ReplicaSet and pods, without interrupting your application's uptime.
- When you want to change **lots of things** at once, you simply change the Deployment spec. The Deployment takes care of the changes that need to be made without you having to worry about the details.
