# package-matrix-js

Matrix package for the [Fōrmulæ](https://formulae.org) programming language.

Fōrmulæ is also a software framework for visualization, edition and manipulation of complex expressions, from many fields. The code for an specific field —i.e. arithmetics— is encapsulated in a single unit called a Fōrmulæ **package**.

This repository contains the source code for the **matrix package**. It covers mathematical operations on matrices.

The GitHub organization [formulae-org](https://github.com/formulae-org) encompasses the source code for the rest of packages, as well as the [web application](https://github.com/formulae-org/formulae-js).

### Capabilities ###

* Visualization of expressions
    * [Determinant](https://en.wikipedia.org/wiki/Determinant) — rendered with vertical bars
    * [Transpose](https://en.wikipedia.org/wiki/Transpose) — rendered as a superscripted ⊤ symbol
    * [Adjoint (conjugate transpose)](https://en.wikipedia.org/wiki/Conjugate_transpose) — rendered as a superscripted † symbol
    * [Kronecker product](https://en.wikipedia.org/wiki/Kronecker_product) — rendered as an infix ⊗ operator

* Edition
    * Transpose, Determinant, Kronecker product, Adjoint entries in the Math.Matrix menu

* Reduction
    * [Determinant of a matrix](https://en.wikipedia.org/wiki/Determinant) (1×1, 2×2, and N×N via cofactor expansion)
    * [Transpose of a matrix](https://en.wikipedia.org/wiki/Transpose)
    * [Kronecker product](https://en.wikipedia.org/wiki/Kronecker_product) of two or more matrices
    * [Adjoint (conjugate transpose)](https://en.wikipedia.org/wiki/Conjugate_transpose) of a matrix
