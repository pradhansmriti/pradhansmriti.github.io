---
title: "Elastic Network Model for HBV Assembly"
description: "A coarse-grained model for studying the structural mechanics and dynamics of Hepatitis B virus assembly."
github: "https://github.com/pradhansmriti/HBV_enm"
layout: "project-detail"
tags: ["Network Models", "Python", "Structural Biology", "HBV"]
weight: 4
lastmod: 2026-10-10
---

## The question

How can we study the mechanics of viral assembly without tracking every atom? My work uses a coarse-grained elastic network model to represent the interactions and flexibility of Hepatitis B virus proteins.

## My approach

I developed the model using OpenMM and NAMD, with parameters learned from all-atom simulation data. The goal is to retain the structural and dynamical behavior relevant to assembly while making larger-scale simulations more tractable.

High-performance computing and enhanced sampling support the exploration of assembly events that are difficult to observe in conventional simulation trajectories.

## Why it matters

Coarse-graining requires decisions about what to preserve and what to simplify. This project connects molecular detail to a model that can be used to investigate assembly dynamics.

## Code

Explore the [model repository](https://github.com/pradhansmriti/HBV_enm).
