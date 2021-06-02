# Welcome

Welcome to Learn Enough Kubernetes to Be Dangerous, also known as Danger Kube!

Kubernetes (abbreviated **k8s**) is a powerful tool for hosting lots of kinds of applications, ranging from "very simple" to "incredibly complex." Whether you have a simple microservice or an entire monolith, Kubernetes can probaly put it online for you. But first you need to learn how to use it.

## Who is this for?

I've spent months of my life building web applications productively with Kubernetes, and it feels like I've spent years of my life fighting with the way Kubernetes does things. I wrote this guide because I wanted to share my mental model with other developers and show them why Kubernetes _might_ be a great fit for them.

If you're a web developer and you feel like you've outgrown Heroku, and you want to run your own applications, but you don't feel comfortable using tools like Ansible or Chef to manage individual compute instances on your favorite cloud provider, then this guide is for you. I'll teach you just enough to be dangerous with Kubernetes and run your own tiny cloud in your own way.

## Why Kubernetes?

Kubernetes is a modern platform for:

- running your code reliably
- keeping your app online at all times
- scaling to meet your users' demand
- deploying updates without interruption to your users

At first glance, this might sound a lot like Heroku or DigitalOcean App Platform. Both of these are Platform-as-a-Service (PaaS) products, meaning they abstract away the operational aspects of running your app. For example, Heroku only asks you to specify the size and count of your app and worker nodes, and it takes care of maintaining those nodes and deploying code to them.

## The Cost of PaaS

Platform-as-a-Service products provide this service by charging you heavily for it and limiting what you can do with the platform. Here's a price comparison between a DigitalOcean droplet and production-ready nodes on the two PaaS platforms mentioned above:

| Platform                               | Memory (GB) | Price   | Caveats                                        |
| -------------------------------------- | ----------- | ------- | ---------------------------------------------- |
| 1x DigitalOcean droplet                | 1 GB        | \$10/mo | None - full access to your machine             |
| 1x DigitalOcean App Platform container | 1 GB        | \$12/mo | Logs and console must be accessed via web app  |
| 1x Heroku dyno                         | 1 GB        | \$50/mo | Dyno is forcefully rebooted every 24h, minimum |

These platforms are nice for web developers who want to get their app online with a minimum of fuss, and they deliver on the product they promise. But they start to cost more as soon as you run more than one or two instances. If you have to run a worker periodically to do batch data processing, that could cost you as much as the rest of your app. If you want to run three microservices instead of one monolith because it suits the structure of your product better, that could triple your hosting costs.

## Be Your Own Platform

Kubernetes provides you with a way to run a cloud of your own.

- When you set up a cluster, you build on a set of nodes that ensure your app remains highly available, even if one of your nodes dies of hardware failure or goes offline for some other reason.
- You pay the market rate for these nodes: a Kubernetes cluster of three DigitalOcean droplets costs the same price as those droplets purchased individually.
- Once you have a cluster of nodes, you can use all the resources however you want. If your cluster has 6 GB of memory available, and your microservices only use 100 MB of memory each, you can fit 60 instances on your nodes!

When you run your own cluster, you regain some of the control you lose with managed platforms. And with services like DigitalOcean Managed Kubernetes,you don't have to do the heavy lifting of setting up hardware and managing nodes because the hosting platform does that for you. All you have to worry about is deploying your code to the cluster and wiring it up to the internet.

So, let's go! Let's start your Kubernetes cluster and play around with it.
