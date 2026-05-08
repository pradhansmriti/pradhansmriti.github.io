---
title: "AgenticVMD"
description: "An LLM-powered chatbot that converts plain English into VMD Tcl scripts to visualize and interact with molecular structures."
image: "/images/fights_virus.png"
github: "https://github.com/pradhansmriti/agentic_vmd"
tags: ["LLM", "Python", "VMD", "Molecular Visualization"]
layout: "project-detail"
weight: 3
---

## Overview

A natural language interface for [VMD (Visual Molecular Dynamics)](https://www.ks.uiuc.edu/Research/vmd/). Upload a PDB file, describe a visualization in plain English, and get a rendered image — no Tcl scripting required.

VMD is a powerful tool for visualizing and analyzing molecular structures, but generating the Tcl scripts it requires can be a steep barrier for researchers without scripting experience. AgenticVMD removes that barrier by letting users describe what they want to see and handling the translation automatically.

## Methods

1. User uploads a PDB file and enters a natural language prompt via a Streamlit frontend
2. The prompt is sent to a FastAPI backend, which forwards it to Claude (Anthropic) to generate a VMD Tcl script
3. VMD runs headlessly and renders the scene using TachyonInternal ray tracing
4. A PNG image is returned and displayed in the UI

The Streamlit frontend also exposes the generated Tcl script in an editable text area, so users can inspect, tweak, and re-render without re-prompting. A separate `/vmd/run-tcl` endpoint allows raw Tcl scripts to be submitted directly for advanced users.

### Example

**Prompt:** `Color chain A red in ribbon representation, hide everything else`

**Generated Tcl:**
```tcl
delrep 0 top
color Display Background white
axes location Off
display depthcue off
mol addrep top
mol modstyle 0 top NewRibbons
mol modcolor 0 top ColorID 1
mol modselect 0 top "chain A"
```

## Results

AgenticVMD successfully converts plain-English descriptions into valid VMD Tcl scripts for a range of visualization tasks, including per-chain coloring, secondary structure representations (ribbons, cartoons, surface), atom selection, and background styling. The rendered PNG images are returned in seconds, making it practical for iterative exploration of molecular structures.

The editable Tcl panel gives researchers a path from natural language to precise scripting — they can start with a prompt and refine the generated script directly, bridging the gap between novice and expert use of VMD.

## Code

The code for this project is available on [GitHub](https://github.com/pradhansmriti/agentic_vmd).
