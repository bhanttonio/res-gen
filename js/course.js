
class CourseHandler
{
	#formCourse;
	#courseName;
	#courseLocation;
	#courseDate;
	#courseIndex;

	#$legend;
	#$btnAuxCourse;
	#$btnMainCourse;
	#$tableBodyCourse;

	#enabledMode = true;


	static #FORM_LEGEND_INSERT = 'Curso';
	static #FORM_LEGEND_UPDATE = 'Curso [Edici&oacute;n]';

	static #BTN_AUX_CLEAN  = 'Limpiar';
	static #BTN_AUX_CANCEL = 'Cancelar';

	static #BTN_MAIN_INSERT = 'Agregar';
	static #BTN_MAIN_UPDATE = 'Editar';

	static #COL_NAME = 0;
	static #COL_LOCATION = 1;
	static #COL_DATE = 2;

	static #CSS_CLASS_LINK_ENABLED  = 'resgen-enabled';
	static #CSS_CLASS_LINK_DISABLED = 'resgen-disabled';
	

	constructor() {
		console.log('\t course handler');

		this.#loadRefs();
		this.#setUpCharCounters();
		this.#setUpAuxButton();
		this.#setUpMainButton();
	}


	/* config methods */

	#loadRefs() {
		console.log('\t\t references');

		this.#formCourse = document.getElementById('formCourse');
		this.#courseName = this.#formCourse.elements.courseName;
		this.#courseLocation = this.#formCourse.elements.courseLocation;
	    this.#courseDate = this.#formCourse.elements.courseDate;
		this.#courseIndex = this.#formCourse.elements.courseIndex;

		this.#$legend = $(this.#formCourse).find('legend');
		this.#$btnAuxCourse = $(this.#formCourse.elements.btnAuxCourse);
		this.#$btnMainCourse = $(this.#formCourse.elements.btnMainCourse);
		this.#$tableBodyCourse = $('table#tableCourse tbody');
	}

	#setUpCharCounters() {
		console.log('\t\t character counters');
		FormUtil.initCharCounters(this.#formCourse);
	}

    #setUpAuxButton() {
    	console.log('\t\t aux button');

		let _this = this;
    	_this.#$btnAuxCourse.on('click', function(e) { 
        	e.preventDefault();
			if (this.textContent === CourseHandler.#BTN_AUX_CANCEL) {
				_this.#formInInsertMode();
				_this.#enableOptions();
			}
			FormUtil.reset(_this.#formCourse);
			this.blur();
    	});
    }

    #setUpMainButton() {
    	console.log('\t\t main button');

		let _this = this;
    	_this.#$btnMainCourse.on('click', function(e) {
	        e.preventDefault();
			if (this.textContent === CourseHandler.#BTN_MAIN_UPDATE) {
				_this.#updateCourse();
			}
			else {
				_this.#insertCourse();
			}
			this.blur();
	    });
    }


	/* crud operations */

	#insertCourse() {
		if ( this.#isValidForm() ) {
	        let newRow = 
	        `<tr>
	            <td>${this.#courseName.value}</td>
	            <td>${this.#courseLocation.value}</td>
				<td>${this.#courseDate.value}</td>
				<td><a href="#" onclick="courseHandler.moveRowUp(event)">&bigtriangleup;</a></td>
				<td><a href="#" onclick="courseHandler.moveRowDown(event)">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="courseHandler.selectCourse(event)">Editar</a></td>
	            <td><a href="#" onclick="courseHandler.removeCourse(event)">Eliminar</a></td>
	        </tr>`;
	        this.#$tableBodyCourse.append(newRow);
			FormUtil.reset(this.#formCourse);

			let index = this.#$tableBodyCourse.children().length - 1;
			console.log(`[course] row ${index} inserted!`);
	    }
	}

	selectCourse(event) { 
		if (this.#enabledMode) 
		{
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBodyCourse.children().eq(index).children();

			this.#courseName.value = $row.eq(CourseHandler.#COL_NAME).text(); this.#courseName.focus();
			this.#courseLocation.value = $row.eq(CourseHandler.#COL_LOCATION).text(); this.#courseLocation.focus();
			this.#courseDate.value = $row.eq(CourseHandler.#COL_DATE).text(); this.#courseDate.focus();
			this.#courseIndex.value = index;

			this.#disableOptions(); 
			console.log(`[course] row ${index} selected!`);
		}
	}

	#updateCourse() {
		let index = this.#courseIndex.value;

		if ( this.#isValidForm() ) {
			let updatedRow = 
			`<td>${this.#courseName.value}</td>
	         <td>${this.#courseLocation.value}</td>
			 <td>${this.#courseDate.value}</td>
			 <td><a href="#" onclick="courseHandler.moveRowUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="courseHandler.moveRowDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="courseHandler.selectCourse(event)">Editar</a></td>
	         <td><a href="#" onclick="courseHandler.removeCourse(event)">Eliminar</a></td>`;
			 
			this.#$tableBodyCourse.children().eq(index).html(updatedRow);

			this.#formInInsertMode();
			FormUtil.reset(this.#formCourse);
			this.#enableOptions();

			console.log(`[course] row ${index} updated!`);
		}
	}

	removeCourse(event) {  
		if (this.#enabledMode) 
		{
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.#$tableBodyCourse.children().eq(index);
			let courseName = $row.children().eq(CourseHandler.#COL_NAME).text();

			if (confirm(`Confirma eliminaci\xF3n de "${courseName}"`)) {
				$row.remove();
				console.log(`[course] row ${index} removed!`);
			}
		}
	}


	/* form validation */

	#isValidForm() {
		return Validator.isInputNotEmpty(this.#courseName) *       // simulates 'non-shortcircuiting and'
			   Validator.isInputNotEmpty(this.#courseLocation) *   // (necessary to apply all individual validations)
			   Validator.isInputNotEmpty(this.#courseDate);
	}


	/* handle insert and updating modes in form */

	#formInInsertMode() {
		this.#$legend.html(CourseHandler.#FORM_LEGEND_INSERT);
		this.#$btnAuxCourse.html(CourseHandler.#BTN_AUX_CLEAN);
		this.#$btnMainCourse.html(CourseHandler.#BTN_MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$legend.html(CourseHandler.#FORM_LEGEND_UPDATE);
		this.#$btnAuxCourse.html(CourseHandler.#BTN_AUX_CANCEL);
		this.#$btnMainCourse.html(CourseHandler.#BTN_MAIN_UPDATE);
	}


	/* handle enabled and disabled modes of links */

	#disableOptions() {
		let $links = this.#$tableBodyCourse.find('tr td a');
		// for (let i = 0; i < $links.length; i++) console.log( $links[i] );
		
		$links.removeClass( CourseHandler.#CSS_CLASS_LINK_ENABLED );
		$links.addClass( CourseHandler.#CSS_CLASS_LINK_DISABLED );
		$links.removeAttr('href');

		this.#enabledMode = false;
	}

	#enableOptions() {
		let $links = this.#$tableBodyCourse.find('tr td a');

		$links.removeClass( CourseHandler.#CSS_CLASS_LINK_DISABLED );
		$links.addClass( CourseHandler.#CSS_CLASS_LINK_ENABLED );
		$links.attr('href', '#');

		this.#enabledMode = true;
	}

	exitDisabledMode() {  
		if (this.#enabledMode == false) {
			this.#$btnAuxCourse.trigger('click');
		}
	}


	/* handle json object  */

	getCourses() {
		let courseList = new Array();

		this.#$tableBodyCourse.children().each( function(idx) {	
			let $tds = $(this).children();

			let nam = $tds.eq(CourseHandler.#COL_NAME).text();
			let loc = $tds.eq(CourseHandler.#COL_LOCATION).text();
			let dat = $tds.eq(CourseHandler.#COL_DATE).text();
			
			courseList.push( new Course(nam, loc, dat, idx) );
		});
		return courseList;
	}


	/* row shifts */

	moveRowUp(event) {
		if (this.#enabledMode) { 
			event.preventDefault();

			let size = this.#$tableBodyCourse.children().length;
			let index = TableUtil.indexOfRow(event);
			let firstIndex = this.#$tableBodyCourse.children().filter(':first').index();
			
			if (size > 1 && index > firstIndex) {
				let $prevTds = this.#$tableBodyCourse.children().eq(index - 1).children();
				let $currTds = this.#$tableBodyCourse.children().eq(index).children();

				let prevNam = $prevTds.eq( CourseHandler.#COL_NAME ).text();
				let prevLoc = $prevTds.eq( CourseHandler.#COL_LOCATION ).text();
				let prevDat = $prevTds.eq( CourseHandler.#COL_DATE ).text();

				let currNam = $currTds.eq( CourseHandler.#COL_NAME ).text();
				let currLoc = $currTds.eq( CourseHandler.#COL_LOCATION ).text();
				let currDat = $currTds.eq( CourseHandler.#COL_DATE ).text();

				$prevTds.eq( CourseHandler.#COL_NAME ).text( currNam );
				$prevTds.eq( CourseHandler.#COL_LOCATION ).text( currLoc );
				$prevTds.eq( CourseHandler.#COL_DATE ).text( currDat );

				$currTds.eq( CourseHandler.#COL_NAME ).text( prevNam );
				$currTds.eq( CourseHandler.#COL_LOCATION ).text( prevLoc );
				$currTds.eq( CourseHandler.#COL_DATE ).text( prevDat );

				console.log('\u2191 shift up');
			}
			// else { console.log(JSON.stringify(this.getCourses(), null, 2)); }
		}
	}

	moveRowDown(event) {
		if (this.#enabledMode) { 
			event.preventDefault();

			let size = this.#$tableBodyCourse.children().length;
			let index = TableUtil.indexOfRow(event);
			let lastIndex = this.#$tableBodyCourse.children().filter(':last').index();

			if (size > 1 && index < lastIndex) {
				let $currTds = this.#$tableBodyCourse.children().eq(index).children();
				let $nextTds = this.#$tableBodyCourse.children().eq(index + 1).children();

				let currNam = $currTds.eq( CourseHandler.#COL_NAME ).text();
				let currLoc = $currTds.eq( CourseHandler.#COL_LOCATION ).text();
				let currDat = $currTds.eq( CourseHandler.#COL_DATE ).text();

				let nextNam = $nextTds.eq( CourseHandler.#COL_NAME ).text();
				let nextLoc = $nextTds.eq( CourseHandler.#COL_LOCATION ).text();
				let nextDat = $nextTds.eq( CourseHandler.#COL_DATE ).text();

				$currTds.eq( CourseHandler.#COL_NAME ).text( nextNam );
				$currTds.eq( CourseHandler.#COL_LOCATION ).text( nextLoc );
				$currTds.eq( CourseHandler.#COL_DATE ).text( nextDat );

				$nextTds.eq( CourseHandler.#COL_NAME ).text( currNam );
				$nextTds.eq( CourseHandler.#COL_LOCATION ).text( currLoc );
				$nextTds.eq( CourseHandler.#COL_DATE ).text( currDat );

				console.log('\u2193 shift down');
			}
			// else { console.log(JSON.stringify(this.getCourses(), null, 2)); }
		}
	}

}//


class Course {
	constructor(name, location, date, index) {
		this.name = name;
		this.location = location;
		this.date = date;
		this.index = index;
	}
}
