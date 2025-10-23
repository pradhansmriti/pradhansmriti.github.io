---
title: "Why I love markov state models and so should you"
Description: "Unoriginal thoughts of a 21st century woman"
layout: "Second blogpost"
date: 2025-09-17
---
In this post I'll talk about a tool I have used quite extensively in my research and which is very close to my heart. Over the course of the post we'll go into understanding:
1. History of markov models
1. What is markov property? 
- For a deterministic process it follows a certain set of rules and we can determine the state of the system at any given time. 
Any given example of it would be predefined forces without any random noise. A stochastic process is when there is a degree of randomness to it, we can predict the state of a system at time $t$ but we can not determine with 100% confidence.
Markov property is defined for systems where state of the system at a future time only depends on state of the system currently and not history of the system. 
This means if we know what the system looks like currently we can predict the state for future time steps.
First comprehensive study of markov processes are done by **Russian mathematician Markov** in 1906.
A good source to go into more mathematical detail of what is stochastic procesess and markov property look into https://mpaldridge.github.io/math2750/S01-stochastic-processes.html
2. What are markov state models?
- Markov state models are used to calculate the transition probability between different states of the system at steady state with key assumption that the system follows Markov property. Markov state models are used in my field of  study (biochem+physics) to study kinetics of events that occur on long timescales. Examples for this include protein folding, protein-protein binding, and virus assembly.
Great paper discussing the key role markov state models play in understanding protein folding model: https://pmc.ncbi.nlm.nih.gov/articles/PMC2933958/   
2. What are markov state models and how has markov state models been useful for me?
- Useful for calculating binding unbinding rates, committor calculation gives insights into assembly pathways and critical nucleus
3. I wanted to learn more about possible areas and systems where markov state models can  be useful. This is just a compilation of examples I found/ could think of. Let me know if you can think of more/ use it for other problems.  
 Use of msms in other fields than comp biochem
- First passage time/hitting time?
- Current uses, proposed/places it can be used?
4. Recommended further reading
- Noe's VAMPNET paper, MSM book 
This post is in no way comprehensive, it's supposed to just give you a brief overview of markov state models.
Markov property: For a stochastic process when the state of time 
$t+\tau$
only depends on the previous state of the system at time $t$
