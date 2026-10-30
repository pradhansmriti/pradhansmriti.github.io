---
draft: true
title: "Understanding Navier Stokes and OpenAI from a physics grad perspective"
description: ""
layout: "single"
date: 2026-09-09T18:43:29-07:00
lastmod: 2026-10-29
tags: []
---
Questions to answer:
1. What is Navier Stokes? Before that why study continuum  mechanics? How study? What are the problems?
2. How it's solved numerically
3. What is the millenium prize question
4. Implications
5. What it doesn't answer

As a physics graduate who is not an expert in this field, I wanted to go back to my undergrad understanding of Navier-Stokes and what does it mean for OpenAI to solve this Millenium problem. This post might contain errors so please let me know. I'm using this an exercise for non-scientific audience so I'll be starting from the very basics. 
Usually when we model any object in the understand the universe our first step is to understand what the force equation might look like.In it's simplest terms it's just:

$\vec{F}=m\vec{a}$

A simple force body diagram for a box at rest might look like:

$F=mg$ here we assume that the box is a point object.

Usually when modelling different systems we consider their properties in two distinct ways: treat them as discrete object where a body is made up of made of smaller constituents and you right down the position, velocity and acceleration of each of these particles. The other is continuum mechanics, where you treat the system as one continous system and write it's forces accordingly. One example of discrete mechanics can be writing force eqn for each particles in an ideal gas. Similarly, continuum mechanics is widely used to model fluids.

Explain how tracking momentum instead of particle positions.

Mention all the instances where it is used? Make sure to mention active nematics
Now heading into the equation that has been all over the internet after OpenAI's announcement. Navier-Stokes equation in it's simplest form can be understood as comprising of three forces: gravitational force, pressure force and viscous force.

Another governing constraint also comes from conservation of mass. 
