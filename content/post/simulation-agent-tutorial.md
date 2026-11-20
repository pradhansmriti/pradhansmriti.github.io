---
title: "Tutorial: Getting started with the Molecular Simulation Workspace"
description: "A step-by-step guide to exploring and running a molecular simulation."
date: 2026-11-18
lastmod: 2026-11-20
draft: true
tags: ["Molecular Dynamics", "Tutorial", "Python"]
---

<!--
HOW TO USE THIS DRAFT
1. Replace the bracketed prompts with your own text and delete these instructions.
2. Put screenshots in static/images/simulation-tutorial/ and refer to them as
   /images/simulation-tutorial/your-image.png. Use descriptive alt text.
3. Copy a step and its image whenever you need another step. Remove unused sections.
4. Preview drafts with `hugo server -D`, then set draft: false when ready to publish.
The image below is the existing demo preview; replace it if you prefer another picture.
-->

When I started my PhD research I came with a heavy background in Physics, some computation experience (mostly in C) but my training had been in overwhelmingly in theoretical and statistical physics. 
So when I started working on Viruses and specifically running molecular dynamics simulations on proteins saying I was a bit lost is an understatement. 
It took me a few weeks just to even get up setup with VMD and preview the proteins I would be working with for the next 4 years (shoutout to 6UI7, 1QGT and 2G33). 
It took me a few more weeks to understand MD simulations, get setup with NAMD, understand errors like *atoms moving too fast, simulation unstable* and be able to visualize any kind of small fluctuation in protein structure. 
With the help of LLMs this learning curve has probably become way easier for new grad students.
But what I wanted to use this simulation agent and MolScript is to be able to visualize these without even installing any softwares for the first time. 
I think the first step to learning is seeing and trust me there is no joy like being able to visualize your protein fluctuating on a computer screen for the first time. 
So this is just a guided tutorial for getting setup and started quickly for a quick preview of your protein of choice.This tutorial generally follows the steps mentioned in this NAMD tutorial. 
## Step 1: Defining the simulation goal
The first step is deciding what we want to simulate, what kind of solvent, what temperature and for how long? This is also something we can change along the way.

![Preview of the Molecular Simulation Workspace interface](/images/mol_sim_tutorial/s1.png)
*Decisions, Decisions*

## Step 2: Uploading protein, refining protein


The [guided browser demo](/demos/mol-vis-sim/) replays recorded results. To work with your own structures, see the [local workspace instructions](https://github.com/pradhansmriti/mol_vis_sim#run-locally).

[Explore the project](/projects/mol-vis-sim/) · [View the source code](https://github.com/pradhansmriti/mol_vis_sim)
