/*
Fōrmulæ matrix package. Module for edition.
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

Matrix.editionCreateMatrix = function() {
	if (Matrix.createMatrixForm === undefined) {
		let table;
		
		table = document.createElement("table");
		table.classList.add("bordered");
		table.innerHTML =
`
<tr>
<th colspan=2>Dimensions of matrix
<tr>
<td>${Matrix.messages.editionNumberRows}
<td><input type="number" value="1" min="1" max="9999">
<tr>
<td>${Matrix.messages.editionNumberColumns}
<td><input type="number" value="1" min="1" max="9999">
<tr>
<th colspan=2><button>Ok</button>

`;

		Matrix.createMatrixForm = table;
	}
	
	let tableRows = Matrix.createMatrixForm.rows;
	let rows = tableRows[1].cells[1].firstChild;
	let cols = tableRows[2].cells[1].firstChild;
	let ok   = tableRows[3].cells[0].firstChild;
	
	ok.onclick = () => {
		let R = parseInt(rows.value);
		if (isNaN(R) || R < 1) {
			alert(Matrix.messages.editionInvalidRows);
			return;
		}
		
		let C = parseInt(cols.value);
		if (isNaN(C) || C < 1) {
			alert(Matrix.messages.editionInvalidColumns);
			return;
		}
		
		Formulae.resetModal();
		
		let newList = Formulae.createExpression("List.List");
		Formulae.sExpression.replaceBy(newList);
		let subList;
		
		for (let r = 0; r < R; ++r) {
			subList = Formulae.createExpression("List.List");
			
			for (let c = 0; c < C; ++c) {
				subList.addChild(Formulae.sExpression.clone());
			}
			
			newList.addChild(subList);
		}
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, newList, false);
	};
	
	Formulae.setModal(Matrix.createMatrixForm);
}

Matrix.editionInsertRow = function(after) {
	let row = Formulae.sExpression.parent;
	if (!(row instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	let r = row.index;
	
	let matrix = row.parent;
	if (!(matrix instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	let cols = Utils.isMatrix(matrix);
	if (cols < 0) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	let newRow = Formulae.createExpression("List.List");
	for (let i = 0; i < cols; ++i) newRow.addChild(Formulae.createExpression("Null"));
	
	matrix.addChildAt(after ? r + 1 : r, newRow);
	
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
};

Matrix.editionDeleteRow = function() {
	let element = Formulae.sExpression;
	
	let row = Formulae.sExpression.parent;
	if (!(row instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	let c = element.index;
	let r = row.index;
	
	let matrix = row.parent;
	if (!(matrix instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	let cols = Utils.isMatrix(matrix);
	if (cols < 0) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	matrix.removeChildAt(r);
	
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	
	if (matrix.children.length === 0) {
		Formulae.setSelected(Formulae.sHandler, matrix, false);
	}
	else if (r >= matrix.children.length) {
		Formulae.setSelected(Formulae.sHandler, matrix.children[r - 1].children[c], false);
	}
	else {
		Formulae.setSelected(Formulae.sHandler, matrix.children[r].children[c], false);
	}
};

Matrix.editionInsertColumn = function(after) {
	let element = Formulae.sExpression;
	
	let row = element.parent;
	if (!(row instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	let c = element.index;
	
	let matrix = row.parent;
	if (!(matrix instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	let cols = Utils.isMatrix(matrix);
	if (cols < 0) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	let rows = matrix.children.length;
	
	for (let i = 0; i < rows; ++i) {
		matrix.children[i].addChildAt(after ? c + 1 : c, Formulae.createExpression("Null"));
	}
	
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
};

Matrix.editionDeleteColumn = function(after) {
	let element = Formulae.sExpression;
	
	let row = Formulae.sExpression.parent;
	if (!(row instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	let c = element.index;
	let r = row.index;
	
	let matrix = row.parent;
	if (!(matrix instanceof Expression)) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	let cols = Utils.isMatrix(matrix);
	if (cols < 0) {
		alert(Matrix.messages.msgNotMatrixElement);
		return;
	}
	
	let rows = matrix.children.length;
	
	for (let i = 0; i < rows; ++i) {
		matrix.children[i].removeChildAt(c);
	}
	
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	
	if (matrix.children[0].children.length === 0) {
		Formulae.setSelected(Formulae.sHandler, matrix, false);
	}
	else if (c >= cols - 1) {
		Formulae.setSelected(Formulae.sHandler, matrix.children[r].children[c - 1], false);
	}
	else {
		Formulae.setSelected(Formulae.sHandler, matrix.children[r].children[c], false);
	}
};

Matrix.setEditions = function() {
	Formulae.addEdition(this.messages.pathMatrix, "packages/org.formulae.matrix/img/matrix.png",               this.messages.leafCreateMatrix,       () => Matrix.editionCreateMatrix());
	Formulae.addEdition(this.messages.pathMatrix, "packages/org.formulae.matrix/img/insert_row_below.png",     this.messages.leafInsertRowBelow,     () => Matrix.editionInsertRow(true));
	Formulae.addEdition(this.messages.pathMatrix, "packages/org.formulae.matrix/img/insert_row_above.png",     this.messages.leafInsertRowAbove,     () => Matrix.editionInsertRow(false));
	Formulae.addEdition(this.messages.pathMatrix, "packages/org.formulae.matrix/img/delete_row.png",           this.messages.leafDeleteRow,          () => Matrix.editionDeleteRow());
	Formulae.addEdition(this.messages.pathMatrix, "packages/org.formulae.matrix/img/insert_column_after.png",  this.messages.leafInsertColumnAfter,  () => Matrix.editionInsertColumn(true));
	Formulae.addEdition(this.messages.pathMatrix, "packages/org.formulae.matrix/img/insert_column_before.png", this.messages.leafInsertColumnBefore, () => Matrix.editionInsertColumn(false));
	Formulae.addEdition(this.messages.pathMatrix, "packages/org.formulae.matrix/img/delete_column.png",        this.messages.leafDeleteColumn,       () => Matrix.editionDeleteColumn());
	
	Formulae.addEdition(this.messages.pathMatrix, null, this.messages.leafTranspose,        () => Expression.wrapperEdition("Math.Matrix.Transpose"              ));
	Formulae.addEdition(this.messages.pathMatrix, null, this.messages.leafDeterminant,      () => Expression.wrapperEdition("Math.Matrix.Determinant"            ));
	Formulae.addEdition(this.messages.pathMatrix, null, this.messages.leafKroneckerProduct, () => Expression.binaryEdition ("Math.Matrix.KroneckerProduct", false));
	Formulae.addEdition(this.messages.pathMatrix, null, this.messages.leafAdjoint,          () => Expression.wrapperEdition("Math.Matrix.Adjoint"                ));
};

