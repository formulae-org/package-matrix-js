/*
Fōrmulæ matrix package. Module for reduction.
Copyright (C) 2015-2026 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

"use strict";

export class Matrix extends Formulae.Package {}

Matrix.matrixTranspose = async (transpose, session) => {
	let matrix = transpose.children[0];
	let cols = Utils.isMatrix(matrix);
	if (cols > 0) {
		let r, c, rows = matrix.children.length;
		let row, result = Formulae.createExpression("List.List");
		
		for (r = 0; r < cols; ++r) {
			result.addChild(row = Formulae.createExpression("List.List"));
			for (c = 0; c < rows; ++c) {
				row.addChild(matrix.children[c].children[r].clone());
			}
		}
		
		transpose.replaceBy(result);
		//session.log("Transpose of a matrix");
		return true;
	}
	
	return false;
};

Matrix.matrixDeterminant = async (determinant, session) => {
	let matrix = determinant.children[0];
	let size = Utils.isMatrix(matrix);
	
	// matrix ?
	if (size <= 0) return false;
	
	// square ?
	if (matrix.children.length != size) return false;
	
	// 1 x 1
	if (size == 1) {
		determinant.replaceBy(matrix.children[0].children[0]);
		//session.log("Determinant of a matrix");
		return true;
	}
	
	// 2 x 2
	if (size == 2) {
		let mult1 = Formulae.createExpression("Math.Arithmetic.Multiplication");
		mult1.addChild(matrix.children[0].children[0]);
		mult1.addChild(matrix.children[1].children[1]);
		
		let mult2 = Formulae.createExpression("Math.Arithmetic.Multiplication");
		mult2.addChild(matrix.children[0].children[1]);
		mult2.addChild(matrix.children[1].children[0]);
		
		let neg = Formulae.createExpression("Math.Arithmetic.Negative");
		neg.addChild(mult2);
		
		let result = Formulae.createExpression("Math.Arithmetic.Addition");
		result.addChild(mult1);
		result.addChild(neg);
		
		determinant.replaceBy(result);
		//session.log("Determinant of a matrix");
		await session.reduce(result);
		return true;
	}
	
	// 3 x 3 or greater
	let addend, multiplication, det, minor, row;
	let addition = Formulae.createExpression("Math.Arithmetic.Addition");
	let r, c, size_1 = size - 1;
	
	for (let part = 0; part < size; ++part) {
		multiplication = Formulae.createExpression("Math.Arithmetic.Multiplication");
		
		det = Formulae.createExpression("Math.Matrix.Determinant");
		det.addChild(minor = Formulae.createExpression("List.List"));
		
		multiplication.addChild(matrix.children[0].children[part].clone());
		multiplication.addChild(det);
		
		if (part % 2 != 0) {
			addend = Formulae.createExpression("Math.Arithmetic.Negative");
			addend.addChild(multiplication);
		}
		else {
			addend = multiplication;
		}
		
		for (r = 0; r < size_1; ++r) {
			minor.addChild(row = Formulae.createExpression("List.List"));
			for (c = 0; c < size_1; ++c) {
				row.addChild(matrix.children[r + 1].children[c >= part ? c + 1 : c].clone());
			}
		}
		
		addition.addChild(addend);
	}
	
	determinant.replaceBy(addition);
	//session.log("Determinant of a matrix");
	await session.reduce(addition);
	return true;
};

Matrix.kroneckerProduct = async (kroneckerProduct, session) => {
	let m1, m2;
	let result, row;
	let r1, c1, r2, c2;
	let C1, R1, C2, R2;
	let mult;
	
	factors: while (true) {
		m1 = kroneckerProduct.children[0];
		C1 = Utils.isMatrix(m1);
		if (C1 < 0) return false;
		R1 = m1.children.length;
		
		m2 = kroneckerProduct.children[1];
		C2 = Utils.isMatrix(m2);
		if (C2 < 0) return false;
		R2 = m2.children.length;
		
		result = Formulae.createExpression("List.List");
		
		for (r1 = 0; r1 < R1; ++r1) {
			for (r2 = 0; r2 < R2; ++r2) {
				row = Formulae.createExpression("List.List");
				
				for (c1 = 0; c1 < C1; ++c1) {
					for (c2 = 0; c2 < C2; ++c2) {
						row.addChild(
							mult = Formulae.createExpression("Math.Arithmetic.Multiplication")
						);
						mult.addChild(m1.children[r1].children[c1].clone());
						mult.addChild(m2.children[r2].children[c2].clone());
					}
				}
				
				result.addChild(row);
			}
		}
		
		if (kroneckerProduct.children.length == 2) {
			break factors;
		}
		else {
			m1.replaceBy(result);
			kroneckerProduct.removeChildAt(1);
			//session.log("Kronecker product");
		}
	}
	
	kroneckerProduct.replaceBy(result);
	//session.log("Kronecker product");
	await session.reduce(result);
	return true;
};

Matrix.adjoint = async (adjoint, session) => {
	let matrix = adjoint.children[0];
	let cols = Utils.isMatrix(matrix);
	if (cols > 0) {
		let r, c, rows = matrix.children.length;
		let row, result = Formulae.createExpression("List.List");
		let conjugate;
		
		for (r = 0; r < cols; ++r) {
			result.addChild(row = Formulae.createExpression("List.List"));
			for (c = 0; c < rows; ++c) {
				row.addChild(
					conjugate = Formulae.createExpression("Math.Complex.Conjugate")
				);
				conjugate.addChild(matrix.children[c].children[r].clone());
			}
		}
		
		adjoint.replaceBy(result);
		//session.log("Adjoint of a matrix");
		
		for (r = 0; r < cols; ++r) {
			row = result.children[r];
			for (c = 0; c < rows; ++c) {
				await session.reduce(row.children[c]);
			}
		}
		
		return true;
	}
	
	return false;
};

Matrix.setReducers = () => {
	ReductionManager.addReducer("Math.Matrix.Transpose",        Matrix.matrixTranspose,   "Matrix.matrixTranspose");
	ReductionManager.addReducer("Math.Matrix.Determinant",      Matrix.matrixDeterminant, "Matrix.matrixDeterminant");
	ReductionManager.addReducer("Math.Matrix.KroneckerProduct", Matrix.kroneckerProduct,  "Matrix.kroneckerProduct");
	ReductionManager.addReducer("Math.Matrix.Adjoint",          Matrix.adjoint,           "Matrix.adjoint");
};
