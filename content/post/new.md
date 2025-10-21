---
title: "Why I love markov state models and so should you"
Description: "Unoriginal thoughts of a 21st century woman"
layout: "Second blogpost"
date: 2025-09-17
---
In this post I'll talk about a tool I have used quite extensively in my research and which is very close to my heart. Over the course of the post we'll go into understanding:

1. What is markov property? 
- State of the system at a future time only depends on state of the system currently and not history of the system. This means if we know what the system looks like currently we can predict the state for future time steps.
2. How markov states are relevant to various fields?
- Master equations; markov chains; applications in finance, weather forecasting etc
2. What are markov state models and how has markov state models been useful for me?
- Useful for calculating binding unbinding rates, committor calculation gives insights into assembly pathways and critical nucleus
3. Use of msms in other fields than comp biochem
- Current uses, proposed/places it can be used?
4. Recommended further reading
- Noe's VAMPNET paper, MSM book 
This post is in no way comprehensive, it's supposed to just give you a brief overview of markov state models.
Markov property: For a stochastic process when the state of time 
$t+\tau$
only depends on the previous state of the system at time $t$
