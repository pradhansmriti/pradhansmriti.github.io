---
title: "AgenticVMD"
description: "An LLM-powered chatbot that converts plain English into VMD Tcl scripts to visualize and interact with molecular structures."
image: "/images/vmdagent2.png"
github: "https://github.com/pradhansmriti/agentic_vmd"
tags: ["LLM", "Python", "VMD", "Molecular Visualization"]
layout: "project-detail"
weight: 3
---

## Overview

A natural language interface for [VMD (Visual Molecular Dynamics)](https://www.ks.uiuc.edu/Research/vmd/). Upload a PDB file or RCSB PDB ID, describe a visualization in plain English, and get a rendered image.

VMD is a powerful tool for visualizing and analyzing molecular structures, but generating the Tcl scripts it requires can be a steep barrier as it is not a common scripting language even among computational scientists. AgenticVMD removes that barrier by letting users describe what they want to see and handling the translation automatically and you can also edit the TCL script and use it yourself.
### Example
{{< figure src="/images/newoutput.gif" width="800px" height="auto" caption="Demo for visualizing agent">}}
## Results

AgenticVMD successfully converts plain-English descriptions into valid VMD Tcl scripts for a range of visualization tasks, including per-chain coloring, secondary structure representations (ribbons, cartoons, surface), atom selection, and background styling. The rendered PNG images are returned in seconds, making it practical for iterative exploration of molecular structures.

The editable Tcl panel gives researchers a path from natural language to precise scripting — they can start with a prompt and refine the generated script directly, bridging the gap between novice and expert use of VMD.

## Code

The code for this project is available on [GitHub](https://github.com/pradhansmriti/agentic_vmd).



