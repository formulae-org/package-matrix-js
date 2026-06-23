/*
Fōrmulæ matrix package. Module for expression definition & visualization.
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

Matrix.Determinant = class extends Expression.UnaryExpression {
	getTag() { return "Math.Matrix.Determinant"; }
	getName() { return Matrix.messages.nameDeterminant; }
	getChildName() { return Matrix.messages.childDeterminant; }
	
	prepareDisplay(context) {
		let child = this.children[0];
		let cols = Utils.isMatrix(child);
		
		if (cols < 0) {
			child.prepareDisplay(context);
		}
		else {
			child.cols = cols;
			child.prepareDisplayAsMatrix(context, 10, 0);
		}
		
		child.x = child.y = 5;
		this.width = child.width + 10;
		this.height = child.height + 10;
		this.horzBaseline = 5 + child.horzBaseline;
		this.vertBaseline = 5 + child.vertBaseline;
	}
	
	display(context, x, y) {
		let child = this.children[0];
		
		if (child.cols === undefined || child.cols < 0) {
			child.display(context, x + child.x, y + child.y);
		}
		else {
			child.displayAsMatrix(context, x + child.x, y + child.y);
		}
		
		context.beginPath();
		context.moveTo (x,              y); context.lineTo(x,              y + this.height); // preventing obfuscation
		context.moveTo (x + this.width, y); context.lineTo(x + this.width, y + this.height); // preventing obfuscation
		context.stroke();
	}
}

Matrix.setExpressions = function(module) {
	Formulae.setExpression(module, "Math.Matrix.Determinant", Matrix.Determinant);
	
	Formulae.setExpression(module, "Math.Matrix.KroneckerProduct", {
		clazz:       Expression.Infix,
		getTag:      () => "Math.Matrix.KroneckerProduct",
		getOperator: () => Matrix.messages.operatorKroneckerProduct,
		getName:     () => Matrix.messages.nameKroneckerProduct,
		min:         -2,
		max:         null
	});
	
	[ "Transpose", "Adjoint" ].forEach(tag => Formulae.setExpression(module, 'Math.Matrix.' + tag, {
		clazz:      Expression.SuperscriptedLiteral,
		getTag:     () => "Math.Matrix." + tag,
		getLiteral: () => Matrix.messages["literal" + tag],
		getName:    () => Matrix.messages["name" + tag]
	}));
};
