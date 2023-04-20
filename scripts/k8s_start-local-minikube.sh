#!/bin/bash
minikube start --vm-driver=docker
minikube addons enable metrics-server
minikube addons enable ingress
minikube addons enable ingress-dns
minikube tunnel


