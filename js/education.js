
class EducationHandler
{
	#elForm;
	#elName;
	#elInstitute;
	#elStart;
	#elEnd;
	#elIndex;

	#$legend;
	#$btnAux;
	#$btnMain;
	#$tableBody;

	#enabledMode = true;   // to enable/disable links in the table


	static #FORM_LEGEND_INSERT = 'Escolaridad';
	static #FORM_LEGEND_UPDATE = 'Escolaridad [Edici&oacute;n]';

	static #BTN_AUX_CLEAN = 'Limpiar';
	static #BTN_AUX_CANCEL = 'Cancelar';

	static #BTN_MAIN_INSERT = 'Agregar';
	static #BTN_MAIN_UPDATE = 'Editar';

	static #COL_NAME = 0;
	static #COL_INSTITUTE = 1;
	static #COL_START = 2;
	static #COL_END = 3;
	

	constructor() {
		console.log('\t education handler');
		this.#loadRefs();
		this.#initCharCounters();
		this.#initAuxBtn();
		this.#initMainBtn();
	}


	/* config methods */

	#loadRefs() {
		console.log('\t\t references');

		this.#elForm = document.getElementById('formEducation');
		this.#elName = this.#elForm.elements.eduName;
		this.#elInstitute = this.#elForm.elements.eduInstitute;
	    this.#elStart = this.#elForm.elements.eduStart;
		this.#elEnd = this.#elForm.elements.eduEnd;
		this.#elIndex = this.#elForm.elements.eduIndex;

		this.#$legend = $(this.#elForm).find('legend');
		this.#$btnAux = $(this.#elForm.elements.btnAuxEdu);
		this.#$btnMain = $(this.#elForm.elements.btnMainEdu);
		this.#$tableBody = $('table#tableEdu tbody');
	}

	#initCharCounters() {
		console.log('\t\t character counters');
		FormUtil.initCharCounters(this.#elForm);
	}

    #initAuxBtn() {
    	console.log('\t\t aux button');

		let _this = this;
    	_this.#$btnAux.on('click', function(e) {   // on click cancel update or just clean form (in insert mode)
        	e.preventDefault();
			if (this.textContent === EducationHandler.#BTN_AUX_CANCEL) {
				_this.#formInInsertMode();   // if an update is canceled, set the form in insert mode and enable links in the table
				_this.#enableOptions();
			}
			FormUtil.reset(_this.#elForm);
			this.blur();
    	});
    }

    #initMainBtn() {
    	console.log('\t\t main button');

		let _this = this;
    	_this.#$btnMain.on('click', function(e) {   // on click update entry or insert a new one
	        e.preventDefault();
			if (this.textContent === EducationHandler.#BTN_MAIN_UPDATE) {
				_this.#update();
			}
			else {
				_this.#insert();
			}
			this.blur();
	    });
    }


	/* crud operations */

	#insert() {
		if ( this.#isValidForm() ) {
	        let newRow = 
	        `<tr>
	            <td>${this.#elName.value}</td>
	            <td>${this.#elInstitute.value}</td>
				<td>${this.#elStart.value}</td>
				<td>${this.#elEnd.value}</td>
				<td><a href="#" onclick="educationHandler.moveUp(event)">&bigtriangleup;</a></td>
				<td><a href="#" onclick="educationHandler.moveDown(event)">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="educationHandler.select(event)">Editar</a></td>
	            <td><a href="#" onclick="educationHandler.remove(event)">Eliminar</a></td>
	        </tr>`;
	        this.#$tableBody.append(newRow);
			FormUtil.reset(this.#elForm);   // clean form only if everything was ok 

			let index = this.#$tableBody.children().length - 1;
			console.log(`[education] row ${index} inserted!`);
	    }
	}

	select(event) {   // not a private method because it's called from the links in the table
		if (this.#enabledMode)   // select entry only if no update is in progress
		{
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBody.children().eq(index).children();

			this.#elName.value = $row.eq(EducationHandler.#COL_NAME).text(); this.#elName.focus();
			this.#elInstitute.value = $row.eq(EducationHandler.#COL_INSTITUTE).text(); this.#elInstitute.focus();
			this.#elStart.value = $row.eq(EducationHandler.#COL_START).text(); this.#elStart.focus();
			this.#elEnd.value = $row.eq(EducationHandler.#COL_END).text(); this.#elEnd.focus();
			this.#elIndex.value = index;

			this.#disableOptions();   // disable links in the table, while updating an entry
			console.log(`[education] row ${index} selected!`);
		}
	}

	#update() {
		let index = this.#elIndex.value;

		if ( this.#isValidForm() ) {
			let updatedRow = 
			`<td>${this.#elName.value}</td>
	         <td>${this.#elInstitute.value}</td>
			 <td>${this.#elStart.value}</td>
			 <td>${this.#elEnd.value}</td>
			 <td><a href="#" onclick="educationHandler.moveUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="educationHandler.moveDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="educationHandler.select(event)">Editar</a></td>
	         <td><a href="#" onclick="educationHandler.remove(event)">Eliminar</a></td>`;
			 
			this.#$tableBody.children().eq(index).html(updatedRow);

			this.#formInInsertMode();  // after an update, return form to insert mode, clean it and enable links in the table
			FormUtil.reset(this.#elForm);
			this.#enableOptions();

			console.log(`[education] row ${index} updated!`);
		}
	}

	remove(event) {       // not a private method because it's called from the links in the table
		if (this.#enabledMode)       // remove entry only if no update is in progress
		{
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.#$tableBody.children().eq(index);
			let eduName = $row.children().eq(EducationHandler.#COL_NAME).text();

			if (confirm(`Confirma eliminaci\xF3n de "${eduName}"`)) {
				$row.remove();
				console.log(`[education] row ${index} removed!`);
			}
		}
	}


	/* form validation */

	#isValidForm() {
		return Validator.isInputNotEmpty(this.#elName) * 
			   Validator.isInputNotEmpty(this.#elInstitute) * 
			   Validator.isYearRangeValid(this.#elStart, this.#elEnd);
	}


	/* handle insert and updating modes in form */

	#formInInsertMode() {
		this.#$legend.html(EducationHandler.#FORM_LEGEND_INSERT);
		this.#$btnAux.html(EducationHandler.#BTN_AUX_CLEAN);
		this.#$btnMain.html(EducationHandler.#BTN_MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$legend.html(EducationHandler.#FORM_LEGEND_UPDATE);
		this.#$btnAux.html(EducationHandler.#BTN_AUX_CANCEL);
		this.#$btnMain.html(EducationHandler.#BTN_MAIN_UPDATE);
	}


	/* handle enabled and disabled modes of links */

	#disableOptions() {
		TableUtil.disableLinks(this.#$tableBody);
		this.#enabledMode = false;
	}

	#enableOptions() {
		TableUtil.enableLinks(this.#$tableBody);
		this.#enabledMode = true;
	}

	exitDisabledMode() {  // not private because it's called from an external method that handles custom events on the tabs component
		if (this.#enabledMode == false) {
			this.#$btnAux.trigger('click');  // trigger cancel button while updating an entry, if the user moves to another tab
		}
	}


	/* row shifts */

	moveUp(event) {
		if (this.#enabledMode) 
			TableUtil.moveRowUp(this.#$tableBody, event);
	}

	moveDown(event) {
		// console.log(JSON.stringify(this.getEducation(), null, 2));
		if (this.#enabledMode)
			TableUtil.moveRowDown(this.#$tableBody, event);
	}


	/* handle json object  */

	getEducation() {
		let eduList = new Array();

		this.#$tableBody.children().each( function(index) {
			let $tds = $(this).children();

			let nam = $tds.eq(EducationHandler.#COL_NAME).text();
			let ins = $tds.eq(EducationHandler.#COL_INSTITUTE).text();
			let sta = $tds.eq(EducationHandler.#COL_START).text();
			let end = $tds.eq(EducationHandler.#COL_END).text();
			
			eduList.push( new Education(nam, ins, sta, end, index) );
		});
		return eduList;
	}

}//


class Education {
	constructor(name, institute, start, end, index) {
		this.name = name;
		this.institute = institute;
		this.start = start;
		this.end = end;
		this.index = index;
	}
}
