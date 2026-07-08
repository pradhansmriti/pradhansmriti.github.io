---
title: "Binding Affinity ML"
description: "An ML pipeline that predicts protein–ligand binding affinity from 3D crystal structures, beating the published RF-Score benchmark with a strict sequence-identity split."
image: "/images/binding_model_comparison.png"
github: "https://github.com/smritipradhan/binding_affinity_ml"
tags: ["Machine Learning", "Drug Discovery", "Python", "Biophysics", "RDKit", "XGBoost"]
layout: "project-detail"
weight: 2
---

## Overview

One of the most important — and expensive — questions in drug discovery is: *does this molecule actually stick to its target?* When a drug works, a small molecule fits snugly into a protein and disrupts or activates it. The strength of that fit is called **binding affinity**, measured as pKd — the higher the number, the tighter the grip.

Running experiments to measure binding affinity for thousands of drug candidates is slow and costly. This project explores how well a machine learning model can predict it directly from the 3D structure of a protein–ligand complex.

## Methods

### Data

The pipeline uses the **PDBbind Refined Set v2020** — a curated database of 4,641 protein–ligand crystal structures, each paired with an experimentally measured pKd value. It's the standard benchmark for evaluating binding affinity prediction methods.

### Feature Engineering

**Ligand features** were computed with RDKit: molecular weight, lipophilicity (logP), polar surface area, rotatable bonds, and hydrogen bond counts. The most impactful addition was **Morgan fingerprints** (ECFP4, 2,048-bit) — a structural barcode encoding the circular chemical neighbourhood around each atom.

**Protein–ligand interface features** were extracted with MDAnalysis: atom contact counts, hydrogen bonds, hydrophobic interactions, pocket size, and contact geometry.

Combined: **2,063 features per complex**.

### Sequence-Identity Split

To avoid sequence leakage — where a kinase in training and a closely related kinase in test inflates apparent performance — proteins were clustered at 30% sequence identity using **mmseqs2** (CD-HIT 4.8.1 from conda was silently broken on macOS). This produced 980 clusters across 7,881 protein chains, with a final split of 3,366 / 578 / 697 (train / val / test).

### Models

Four models were trained: Linear Regression, Random Forest, XGBoost, and LightGBM. A shallow MLP (two hidden layers, PyTorch) was added as a neural network baseline. A 3-layer Graph Isomorphism Network (GIN) was also evaluated, operating on SMILES-derived molecular graphs with 35-dimensional atom node features and 8 interaction features appended at the graph level.

## Results

| Model | RMSE | R² |
|---|---|---|
| Random Forest | 1.265 | 0.570 |
| XGBoost (tuned) | 1.285 | 0.556 |
| GIN (3-layer) | 1.428 | 0.452 |
| Shallow MLP | 1.610 | 0.304 |
| *Published RF-Score benchmark* | *~1.48* | *~0.52* |

![Model comparison on the validation set: RMSE, R², and Pearson r across Linear Regression, Random Forest, XGBoost, and LightGBM](/images/binding_model_comparison.png)

Tree-based models clustered tightly together and far ahead of the linear baseline. Random Forest came out narrowly on top, and its predictions track the experimental pKd values closely across the full affinity range:

![Random Forest predicted vs. actual pKd and the residual distribution, centred near zero](/images/binding_residuals.png)

**Morgan fingerprints were the single biggest improvement** — adding 2,048 structural bits pushed test R² from ~0.39 to 0.57 and RMSE from ~1.51 to 1.265. Tree models outperformed the neural network, which is expected at this dataset size (~3,000 training examples).

**SHAP analysis** confirmed the model learned real chemistry: the top features by importance were hydrophobic contact count, molecular weight, total atom contacts, lipophilicity, and pocket size — all quantities medicinal chemists care about.

![SHAP beeswarm plot for the tuned XGBoost model, with hydrophobic_count, mol_weight, and atom_contacts as the most influential features](/images/binding_shap_beeswarm.png)

The beeswarm view also shows the *direction* of each effect: more hydrophobic contacts and larger pocket sizes push predicted affinity up, consistent with how real binding works. Individual Morgan fingerprint bits (e.g. `fp_1771`, `fp_1476`) each contribute a little, but collectively the 2,048-bit structural barcode is what closed most of the gap to the benchmark.

The GIN matched the published benchmark but trailed Random Forest, consistent with the known pattern that GNNs need ~50k+ samples to outperform gradient-boosted trees on small tabular datasets.

## What's Next

The main limitation is that the pipeline works from **static crystal structures**. Proteins flex dynamically, and binding strength often depends on how much a protein must deform to accommodate a ligand. The natural extension is to incorporate **molecular dynamics (MD) simulations**: run short trajectories (10–50 ns), sample hundreds of frames, and extract time-averaged features like H-bond occupancy, average pocket volume, and ligand positional fluctuations. MM-GBSA end-point free energy estimates from trajectories are another candidate feature — noisy on their own, but potentially correctable by the ML model using structural context.

## Code

The code for this project is available on [GitHub](https://github.com/pradhansmriti/ml_binding_affinity).
