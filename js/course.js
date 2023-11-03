
class CourseHandler
{
	#elForm;
	#elName;
	#elLocation;
	#elDate;
	#elIndex;

	#$legend;
	#$btnAux;
	#$btnMain;
	#$tableBody;

	#enabledMode = true;


	static #FORM_LEGEND_INSERT = 'Curso';
	static #FORM_LEGEND_UPDATE = 'Curso [Edici&oacute;n]';

	static #BTN_AUX_CLEAN  = 'Limpiar';
	static #BTN_AUX_CANCEL = 'Anular';

	static #BTN_MAIN_INSERT = 'A&ntilde;adir';
	static #BTN_MAIN_UPDATE = 'Editar';

	static #COL_NAME = 0;
	static #COL_LOCATION = 1;
	static #COL_DATE = 2;
	

	constructor() {
		console.log('\t course handler');
		this.#loadRefs();
		this.#initCharCounters();
		this.#initAuxBtn();
		this.#initMainBtn();
	}


	#loadRefs() {
		console.log('\t\t references');

		this.#elForm = document.getElementById('formCourse');
		this.#elName = this.#elForm.elements.courseName;
		this.#elLocation = this.#elForm.elements.courseLocation;
	    this.#elDate = this.#elForm.elements.courseDate;
		this.#elIndex = this.#elForm.elements.courseIndex;

		this.#$legend = $(this.#elForm).find('legend');
		this.#$btnAux = $(this.#elForm.elements.btnAuxCourse);
		this.#$btnMain = $(this.#elForm.elements.btnMainCourse);
		this.#$tableBody = $('table#tableCourse tbody');
	}

	#initCharCounters() {
		console.log('\t\t character counters');
		FormUtil.initCharCounters(this.#elForm);
	}

    #initAuxBtn() {
    	console.log('\t\t aux button');
    	this.#$btnAux.on('click', event => { 
        	event.preventDefault();
			if (event.target.textContent === CourseHandler.#BTN_AUX_CANCEL) {
				this.#formInInsertMode();
				this.#enableOptions();
			}
			FormUtil.reset(this.#elForm);
			event.target.blur();
    	});
    }

    #initMainBtn() {
    	console.log('\t\t main button');
    	this.#$btnMain.on('click', event => {
	        event.preventDefault();
			if (event.target.textContent === CourseHandler.#BTN_MAIN_UPDATE) 
				this.#update();
			else 
				this.#insert();
			event.target.blur();
	    });
    }


	#insert() {
		if (this.#isValidForm()) {
	        let newRow = 
	        `<tr>
	            <td>${this.#elName.value}</td>
	            <td>${this.#elLocation.value}</td>
				<td>${this.#elDate.value}</td>
				<td><a href="#" onclick="courseHandler.moveUp(event)">&bigtriangleup;</a></td>
				<td><a href="#" onclick="courseHandler.moveDown(event)">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="courseHandler.select(event)">Editar</a></td>
	            <td><a href="#" onclick="courseHandler.remove(event)">Eliminar</a></td>
	        </tr>`;
	        this.#$tableBody.append(newRow);
			FormUtil.reset(this.#elForm);

			let index = this.#$tableBody.children().length - 1;
			console.log(`[course] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBody.children().eq(index).children();

			this.#elName.value = $row.eq(CourseHandler.#COL_NAME).text(); this.#elName.focus();
			this.#elLocation.value = $row.eq(CourseHandler.#COL_LOCATION).text(); this.#elLocation.focus();
			this.#elDate.value = $row.eq(CourseHandler.#COL_DATE).text(); this.#elDate.focus();
			this.#elIndex.value = index;

			this.#disableOptions();
			console.log(`[course] row ${index} selected!`);
		}
	}

	#update() {
		let index = this.#elIndex.value;

		if (this.#isValidForm()) {
			let updatedRow = 
			`<td>${this.#elName.value}</td>
	         <td>${this.#elLocation.value}</td>
			 <td>${this.#elDate.value}</td>
			 <td><a href="#" onclick="courseHandler.moveUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="courseHandler.moveDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="courseHandler.select(event)">Editar</a></td>
	         <td><a href="#" onclick="courseHandler.remove(event)">Eliminar</a></td>`;
			 
			this.#$tableBody.children().eq(index).html(updatedRow);

			this.#formInInsertMode();
			FormUtil.reset(this.#elForm);
			this.#enableOptions();

			console.log(`[course] row ${index} updated!`);
		}
	}

	remove(event) {  
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.#$tableBody.children().eq(index);
			let courseName = $row.children().eq(CourseHandler.#COL_NAME).text();

			if (confirm(`Confirma eliminaci\xF3n de "${courseName}"`)) {
				$row.remove();
				console.log(`[course] row ${index} removed!`);
			}
		}
	}


	#isValidForm() {
		return Validator.isInputNotEmpty(this.#elName) *       // simulates 'non-shortcircuiting and'
			   Validator.isInputNotEmpty(this.#elLocation) *   // (necessary to apply all individual validations)
			   Validator.isInputNotEmpty(this.#elDate);
	}


	#formInInsertMode() {
		this.#$legend.html(CourseHandler.#FORM_LEGEND_INSERT);
		this.#$btnAux.html(CourseHandler.#BTN_AUX_CLEAN);
		this.#$btnMain.html(CourseHandler.#BTN_MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$legend.html(CourseHandler.#FORM_LEGEND_UPDATE);
		this.#$btnAux.html(CourseHandler.#BTN_AUX_CANCEL);
		this.#$btnMain.html(CourseHandler.#BTN_MAIN_UPDATE);
	}


	#disableOptions() {
		TableUtil.disableLinks(this.#$tableBody);
		this.#enabledMode = false;
	}

	#enableOptions() {
		TableUtil.enableLinks(this.#$tableBody);
		this.#enabledMode = true;
	}

	exitDisabledMode() {  
		if (this.#enabledMode == false)
			this.#$btnAux.trigger('click');
	}


	moveUp(event) {
		if (this.#enabledMode)
			TableUtil.moveRowUp( this.#$tableBody, event );
	}

	moveDown(event) {
		if (this.#enabledMode) 
			TableUtil.moveRowDown( this.#$tableBody, event );
	}


	getCourses() {
		let courseList = new Array();
		this.#$tableBody.children().each( function(idx) {	
			let nam = $(this).children().eq(CourseHandler.#COL_NAME).text();
			let loc = $(this).children().eq(CourseHandler.#COL_LOCATION).text();
			let dat = $(this).children().eq(CourseHandler.#COL_DATE).text();
			courseList.push( new Course(nam, loc, dat, idx) );
		});
		return courseList;
	}

}//

