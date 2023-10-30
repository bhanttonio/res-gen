
class EducationHandler
{
	#formEdu;
	#eduName;
	#eduInstitute;
	#eduStart;
	#eduEnd;
	#eduIndex;

	#$legend;
	#$btnAuxEdu;
	#$btnMainEdu;
	#$tableBodyEdu;

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

	static #CSS_CLASS_LINK_ENABLED = 'resgen-enabled';
	static #CSS_CLASS_LINK_DISABLED = 'resgen-disabled';
	

	constructor() {
		console.log('\t education handler');

		this.#loadRefs();
		this.#setUpCharCounters(true);
		this.#setUpAuxButton();
		this.#setUpMainButton();
	}


	/* config methods */

	#loadRefs() {
		console.log('\t\t references');

		this.#formEdu = document.getElementById('formEducation');
		this.#eduName = this.#formEdu.elements.eduName;
		this.#eduInstitute = this.#formEdu.elements.eduInstitute;
	    this.#eduStart = this.#formEdu.elements.eduStart;
		this.#eduEnd = this.#formEdu.elements.eduEnd;
		this.#eduIndex = this.#formEdu.elements.eduIndex;

		this.#$legend = $(this.#formEdu).find('legend');
		this.#$btnAuxEdu = $(this.#formEdu.elements.btnAuxEdu);
		this.#$btnMainEdu = $(this.#formEdu.elements.btnMainEdu);
		this.#$tableBodyEdu = $('table#tableEdu tbody');
	}

	#setUpCharCounters(firstCall) {
		if (firstCall)
			console.log('\t\t character counters');

		$(this.#eduName).characterCounter();
		$(this.#eduInstitute).characterCounter();
		$(this.#eduStart).characterCounter();
		$(this.#eduEnd).characterCounter();
	}

    #setUpAuxButton() {
    	console.log('\t\t aux button');

		let _this = this;
    	_this.#$btnAuxEdu.on('click', function(e) {   // on click cancel update or just clean form (in insert mode)
        	e.preventDefault();
			if (this.textContent === EducationHandler.#BTN_AUX_CANCEL) {
				_this.#formInInsertMode();   // if an update is canceled, set the form in insert mode and enable links in the table
				_this.#enableOptions();
			}
			_this.#resetForm();
			this.blur();
    	});
    }

    #setUpMainButton() {
    	console.log('\t\t main button');

		let _this = this;
    	_this.#$btnMainEdu.on('click', function(e) {   // on click update entry or insert a new one
	        e.preventDefault();
			if (this.textContent === EducationHandler.#BTN_MAIN_UPDATE) {
				_this.#updateEducation();
			}
			else {
				_this.#insertEducation();
			}
			this.blur();
	    });
    }


	/* crud operations */

	#insertEducation() {
	    let name = this.#eduName.value.trim();
	    let institute = this.#eduInstitute.value.trim();
	    let start = this.#eduStart.value.trim();
	    let end = this.#eduEnd.value.trim();

		if ( this.#isValidForm(name, institute, start, end) ) {
	        let newRow = 
	        `<tr>
	            <td>${name}</td>
	            <td>${institute}</td>
				<td>${start}</td>
				<td>${end}</td>
				<td><a href="#" onclick="educationHandler.moveRowUp(event)">&bigtriangleup;</a></td>
				<td><a href="#" onclick="educationHandler.moveRowDown(event)">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="educationHandler.selectEducation(event)">Editar</a></td>
	            <td><a href="#" onclick="educationHandler.removeEducation(event)">Eliminar</a></td>
	        </tr>`;
	        this.#$tableBodyEdu.append(newRow);
			this.#resetForm();   // clean form only if everything was ok 

			let index = this.#$tableBodyEdu.children().length - 1;
			console.log(`[education] row ${index} inserted!`);
	    }
	}

	selectEducation(event) {   // not a private method because it's called from the links in the table
		if (this.#enabledMode)   // select entry only if no update is in progress
		{
			event.preventDefault();
			let index = this.#indexFrom(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBodyEdu.children().eq(index).children();

			this.#eduName.value = $row.eq(EducationHandler.#COL_NAME).text(); this.#eduName.focus();
			this.#eduInstitute.value = $row.eq(EducationHandler.#COL_INSTITUTE).text(); this.#eduInstitute.focus();
			this.#eduStart.value = $row.eq(EducationHandler.#COL_START).text(); this.#eduStart.focus();
			this.#eduEnd.value = $row.eq(EducationHandler.#COL_END).text(); this.#eduEnd.focus();
			this.#eduIndex.value = index;

			this.#disableOptions();   // disable links in the table, while updating an entry
			console.log(`[education] row ${index} selected!`);
		}
	}

	#updateEducation() {
		let name = this.#eduName.value.trim();
	    let institute = this.#eduInstitute.value.trim();
	    let start = this.#eduStart.value.trim();
	    let end = this.#eduEnd.value.trim();
		let index = this.#eduIndex.value.trim();

		if ( this.#isValidForm(name, institute, start, end) ) {
			let updatedRow = 
			`<td>${name}</td>
	         <td>${institute}</td>
			 <td>${start}</td>
			 <td>${end}</td>
			 <td><a href="#" onclick="educationHandler.moveRowUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="educationHandler.moveRowDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="educationHandler.selectEducation(event)">Editar</a></td>
	         <td><a href="#" onclick="educationHandler.removeEducation(event)">Eliminar</a></td>`;
			 
			this.#$tableBodyEdu.children().eq(index).html(updatedRow);

			this.#formInInsertMode();  // after an update, return form to insert mode, clean it and enable links in the table
			this.#resetForm();
			this.#enableOptions();

			console.log(`[education] row ${index} updated!`);
		}
	}

	removeEducation(event) {       // not a private method because it's called from the links in the table
		if (this.#enabledMode)       // remove entry only if no update is in progress
		{
			event.preventDefault();
			let index = this.#indexFrom(event);

			let $row = this.#$tableBodyEdu.children().eq(index);
			let eduName = $row.children().eq(EducationHandler.#COL_NAME).text();

			if (confirm(`Confirma eliminaci\xF3n de "${eduName}"`)) {
				$row.remove();
				console.log(`[education] row ${index} removed!`);
			}
		}
	}

	#indexFrom(event) {
		return $(event.target).parent().parent().index();
	}


	/* form validation */

	#isValidForm(name, institute, start, end) {
		let isValidName = true;
		let isValidInstitute = true;
		let isValidStart = true;
		let isValidEnd = true;

		if (name.trim() === '') {
			this.#addInvalidStyle(this.#eduName);
			isValidName = false;
		}
		if (institute.trim() === '') {
			this.#addInvalidStyle(this.#eduInstitute);
			isValidInstitute = false;
		}
		if (start.trim() === '' || isNaN(start) || start < 1000 || start > 9999) { 
			this.#addInvalidStyle(this.#eduStart);
			isValidStart = false;
		}
		if (end.trim() === '' || isNaN(end) || end < 1000 || end > 9999 || end < start) {
			this.#addInvalidStyle(this.#eduEnd);
			isValidEnd = false;
		}
		return isValidName && isValidInstitute && isValidStart && isValidEnd;
	}

	#addInvalidStyle(element) {
		element.classList.add('invalid');
	}


	/* handle insert and updating modes in form */

	#resetForm() {
		this.#formEdu.reset();
		this.#setUpCharCounters(false);
	}

	#formInInsertMode() {
		this.#$legend.html(EducationHandler.#FORM_LEGEND_INSERT);
		this.#$btnAuxEdu.html(EducationHandler.#BTN_AUX_CLEAN);
		this.#$btnMainEdu.html(EducationHandler.#BTN_MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$legend.html(EducationHandler.#FORM_LEGEND_UPDATE);
		this.#$btnAuxEdu.html(EducationHandler.#BTN_AUX_CANCEL);
		this.#$btnMainEdu.html(EducationHandler.#BTN_MAIN_UPDATE);
	}


	/* handle enabled and disabled modes of links */

	#disableOptions() {
		let $links = this.#$tableBodyEdu.find('tr td a');
		// for (let i = 0; i < $links.length; i++) console.log( $links[i] );
		
		$links.removeClass( EducationHandler.#CSS_CLASS_LINK_ENABLED );
		$links.addClass( EducationHandler.#CSS_CLASS_LINK_DISABLED );
		$links.removeAttr('href');

		this.#enabledMode = false;
	}

	#enableOptions() {
		let $links = this.#$tableBodyEdu.find('tr td a');

		$links.removeClass( EducationHandler.#CSS_CLASS_LINK_DISABLED );
		$links.addClass( EducationHandler.#CSS_CLASS_LINK_ENABLED );
		$links.attr('href', '#');

		this.#enabledMode = true;
	}

	exitDisabledMode() {  // not private because it's called from an external method that handles custom events on the tabs component
		if (this.#enabledMode == false) {
			this.#$btnAuxEdu.trigger('click');  // trigger cancel button while updating an entry, if the user moves to another tab
		}
	}


	/* handle json object  */

	getEducation() {
		let eduList = new Array();

		this.#$tableBodyEdu.children().each( function(index) {
			let $tds = $(this).children();

			let nam = $tds.eq(EducationHandler.#COL_NAME).text();
			let ins = $tds.eq(EducationHandler.#COL_INSTITUTE).text();
			let sta = $tds.eq(EducationHandler.#COL_START).text();
			let end = $tds.eq(EducationHandler.#COL_END).text();
			
			eduList.push( new Education(nam, ins, sta, end, index) );
		});
		return eduList;
	}


	/* row shifts */

	moveRowUp(event) {
		if (this.#enabledMode) { 
			event.preventDefault();

			let size = this.#$tableBodyEdu.children().length;
			let index = this.#indexFrom(event);
			let firstIndex = this.#$tableBodyEdu.children().filter(':first').index();
			
			if (size > 1 && index > firstIndex) {
				let $prevRow = this.#$tableBodyEdu.children().eq(index - 1);
				let $currRow = this.#$tableBodyEdu.children().eq(index);
				let $prevTds = $prevRow.children();
				let $currTds = $currRow.children();

				let prevNam = $prevTds.eq( EducationHandler.#COL_NAME ).text();
				let prevIns = $prevTds.eq( EducationHandler.#COL_INSTITUTE ).text();
				let prevSta = $prevTds.eq( EducationHandler.#COL_START ).text();
				let prevEnd = $prevTds.eq( EducationHandler.#COL_END ).text();

				let currNam = $currTds.eq( EducationHandler.#COL_NAME ).text();
				let currIns = $currTds.eq( EducationHandler.#COL_INSTITUTE ).text();
				let currSta = $currTds.eq( EducationHandler.#COL_START ).text();
				let currEnd = $currTds.eq( EducationHandler.#COL_END ).text();

				$prevTds.eq( EducationHandler.#COL_NAME ).text( currNam );
				$prevTds.eq( EducationHandler.#COL_INSTITUTE ).text( currIns );
				$prevTds.eq( EducationHandler.#COL_START ).text( currSta );
				$prevTds.eq( EducationHandler.#COL_END ).text( currEnd );

				$currTds.eq( EducationHandler.#COL_NAME ).text( prevNam );
				$currTds.eq( EducationHandler.#COL_INSTITUTE ).text( prevIns );
				$currTds.eq( EducationHandler.#COL_START ).text( prevSta );
				$currTds.eq( EducationHandler.#COL_END ).text( prevEnd );

				console.log('\u2191 shift up');
			}
			// else { console.log(JSON.stringify(this.getEducation(), null, 2)); }
		}
	}

	moveRowDown(event) {
		if (this.#enabledMode) { 
			event.preventDefault();

			let size = this.#$tableBodyEdu.children().length;
			let index = this.#indexFrom(event);
			let lastIndex = this.#$tableBodyEdu.children().filter(':last').index();

			if (size > 1 && index < lastIndex) {
				let $currRow = this.#$tableBodyEdu.children().eq(index);
				let $nextRow = this.#$tableBodyEdu.children().eq(index + 1);
				let $currTds = $currRow.children();
				let $nextTds = $nextRow.children();

				let currNam = $currTds.eq( EducationHandler.#COL_NAME ).text();
				let currIns = $currTds.eq( EducationHandler.#COL_INSTITUTE ).text();
				let currSta = $currTds.eq( EducationHandler.#COL_START ).text();
				let currEnd = $currTds.eq( EducationHandler.#COL_END ).text();

				let nextNam = $nextTds.eq( EducationHandler.#COL_NAME ).text();
				let nextIns = $nextTds.eq( EducationHandler.#COL_INSTITUTE ).text();
				let nextSta = $nextTds.eq( EducationHandler.#COL_START ).text();
				let nextEnd = $nextTds.eq( EducationHandler.#COL_END ).text();

				$currTds.eq( EducationHandler.#COL_NAME ).text( nextNam );
				$currTds.eq( EducationHandler.#COL_INSTITUTE ).text( nextIns );
				$currTds.eq( EducationHandler.#COL_START ).text( nextSta );
				$currTds.eq( EducationHandler.#COL_END ).text( nextEnd );

				$nextTds.eq( EducationHandler.#COL_NAME ).text( currNam );
				$nextTds.eq( EducationHandler.#COL_INSTITUTE ).text( currIns );
				$nextTds.eq( EducationHandler.#COL_START ).text( currSta );
				$nextTds.eq( EducationHandler.#COL_END ).text( currEnd );

				console.log('\u2193 shift down');
			}
			// else { console.log(JSON.stringify(this.getEducation(), null, 2)); }
		}
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
