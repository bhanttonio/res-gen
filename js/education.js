
class EducationHandler
{
	#formEdu
	#eduName
	#eduInstitute
	#eduStart
	#eduEnd
	#eduIndex

	#$legend
	#$btnAuxEdu
	#$btnMainEdu
	#$rowsEdu

	#enabledMode = true   // to enable/disable links in the table


	static #FORM_LEGEND_INSERT = 'Escolaridad'
	static #FORM_LEGEND_UPDATE = 'Escolaridad [Edici&oacute;n]'

	static #BTN_AUX_CLEAN = 'Limpiar'
	static #BTN_AUX_CANCEL = 'Cancelar'

	static #BTN_MAIN_INSERT = 'A&ntilde;adir'
	static #BTN_MAIN_UPDATE = 'Editar'

	static #COL_NAME = 0
	static #COL_INSTITUTE = 1
	static #COL_START = 2
	static #COL_END = 3

	static #CSS_CLASS_LINK_ENABLED = 'resgen-enabled'
	static #CSS_CLASS_LINK_DISABLED = 'resgen-disabled'
	

	constructor() {
		console.log('\t education handler')

		this.#loadRefs()
		this.#setUpCharCounters(true)
		this.#setUpAuxButton()
		this.#setUpMainButton()
	}


	/* config methods */

	#loadRefs() {
		console.log('\t\t references')

		this.#formEdu = document.getElementById('formEducation')
		this.#eduName = this.#formEdu.elements.eduName
		this.#eduInstitute = this.#formEdu.elements.eduInstitute
	    this.#eduStart = this.#formEdu.elements.eduStart
		this.#eduEnd = this.#formEdu.elements.eduEnd
		this.#eduIndex = this.#formEdu.elements.eduIndex

		this.#$legend = $(this.#formEdu).find('legend')
		this.#$btnAuxEdu = $(this.#formEdu.elements.btnAuxEdu)
		this.#$btnMainEdu = $(this.#formEdu.elements.btnMainEdu)
		this.#$rowsEdu = $('table#tableEdu tbody tr')
	}

	#setUpCharCounters(firstCall) {
		if (firstCall)
			console.log('\t\t character counters')

		$(this.#eduName).characterCounter()
		$(this.#eduInstitute).characterCounter()
		$(this.#eduStart).characterCounter()
		$(this.#eduEnd).characterCounter()
	}

    #setUpAuxButton() {
    	console.log('\t\t aux button')

		let _this = this
    	_this.#$btnAuxEdu.on('click', function(e) {   // on click cancel update or just clean form (in insert mode)
        	e.preventDefault()
			if (this.textContent === EducationHandler.#BTN_AUX_CANCEL) {
				_this.#formInInsertMode()   // if an update is canceled, set the form in insert mode and enable links in the table
				_this.#enableOptions()
			}
			_this.#resetForm()
			this.blur()
    	})
    }

    #setUpMainButton() {
    	console.log('\t\t main button')

		let _this = this
    	_this.#$btnMainEdu.on('click', function(e) {   // on click update entry or insert a new one
	        e.preventDefault()
			if (this.textContent === EducationHandler.#BTN_MAIN_UPDATE) {
				_this.#updateEducation()
			}
			else {
				_this.#insertEducation()
			}
			this.blur()	
	    })
    }


	/* crud operations */

	#insertEducation() {
	    let name = this.#eduName.value.trim()
	    let institute = this.#eduInstitute.value.trim()
	    let start = this.#eduStart.value.trim()
	    let end = this.#eduEnd.value.trim()

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
	        </tr>`
	        this.#$rowsEdu.parent().append(newRow)
			this.#resetForm()   // clean form only if everything was ok 

			let index = this.#$rowsEdu.length - 1
			console.log(`[education] row ${index} inserted!`)
	    }
	}

	selectEducation(event) {   // not a private method because it's called from the links in the table
		if (this.#enabledMode)   // select entry only if no update is in progress
		{
			event.preventDefault()
			let index = this.#indexFrom(event)

			this.#formInUpdateMode()
			let $row = this.#$rowsEdu.eq(index).children()

			this.#eduName.value = $row.eq(EducationHandler.#COL_NAME).text(); this.#eduName.focus()
			this.#eduInstitute.value = $row.eq(EducationHandler.#COL_INSTITUTE).text(); this.#eduInstitute.focus()
			this.#eduStart.value = $row.eq(EducationHandler.#COL_START).text(); this.#eduStart.focus()
			this.#eduEnd.value = $row.eq(EducationHandler.#COL_END).text(); this.#eduEnd.focus()
			this.#eduIndex.value = index

			this.#disableOptions()   // disable links in the table, while updating an entry
			console.log(`[education] row ${index} selected!`)
		}
	}

	#updateEducation() {
		let name = this.#eduName.value.trim()
	    let institute = this.#eduInstitute.value.trim()
	    let start = this.#eduStart.value.trim()
	    let end = this.#eduEnd.value.trim()
		let index = this.#eduIndex.value.trim()

		if ( this.#isValidForm(name, institute, start, end) ) {
			let updatedRow = 
			`<td>${name}</td>
	         <td>${institute}</td>
			 <td>${start}</td>
			 <td>${end}</td>
			 <td><a href="#" onclick="educationHandler.moveRowUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="educationHandler.moveRowDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="educationHandler.selectEducation(event)">Editar</a></td>
	         <td><a href="#" onclick="educationHandler.removeEducation(event)">Eliminar</a></td>`
			 
			this.#$rowsEdu.eq(index).html(updatedRow)

			this.#formInInsertMode()  // after an update, return form to insert mode, clean it and enable links in the table
			this.#resetForm()
			this.#enableOptions()

			console.log(`[education] row ${index} updated!`)
		}
	}

	removeEducation(event) {       // not a private method because it's called from the links in the table
		if (this.#enabledMode)       // remove entry only if no update is in progress
		{
			event.preventDefault()
			let index = this.#indexFrom(event)

			let $row = this.#$rowsEdu.eq(index)
			let eduName = $row.children().eq(EducationHandler.#COL_NAME).text()

			if (confirm(`Confirma eliminaci\xF3n de '${eduName}'`)) {
				$row.remove()
				console.log(`[education] row ${index} removed!`)
			}
		}
	}

	#indexFrom(event) {
		return $(event.target).parent().parent().index();
	}


	/* form validation */

	#isValidForm(name, institute, start, end) {
		let isValidName = true
		let isValidInstitute = true
		let isValidStart = true
		let isValidEnd = true 

		if (name.trim() === '') {
			this.#addInvalidStyle(this.#eduName)
			isValidName = false
		}
		if (institute.trim() === '') {
			this.#addInvalidStyle(this.#eduInstitute)
			isValidInstitute = false
		}
		if (start.trim() === '' || isNaN(start) || start < 1000 || start > 9999) { 
			this.#addInvalidStyle(this.#eduStart)
			isValidStart = false
		}
		if (end.trim() === '' || isNaN(end) || end < 1000 || end > 9999 || end < start) {
			this.#addInvalidStyle(this.#eduEnd)
			isValidEnd = false
		}
		return isValidName && isValidInstitute && isValidStart && isValidEnd
	}

	#addInvalidStyle(element) {
		element.classList.add('invalid')
	}


	/* handle insert and updating modes in form */

	#resetForm() {
		this.#formEdu.reset()
		this.#setUpCharCounters(false)
	}

	#formInInsertMode() {
		this.#$legend.html(EducationHandler.#FORM_LEGEND_INSERT)
		this.#$btnAuxEdu.html(EducationHandler.#BTN_AUX_CLEAN)
		this.#$btnMainEdu.html(EducationHandler.#BTN_MAIN_INSERT)
	}

	#formInUpdateMode() {
		this.#$legend.html(EducationHandler.#FORM_LEGEND_UPDATE)
		this.#$btnAuxEdu.html(EducationHandler.#BTN_AUX_CANCEL)
		this.#$btnMainEdu.html(EducationHandler.#BTN_MAIN_UPDATE)
	}


	/* handle enabled and disabled modes of links */

	#disableOptions() {
		let $links = this.#$rowsEdu.find('td a')
		// for (let i = 0; i < $links.length; i++) console.log( $links[i] )
		
		$links.removeClass( EducationHandler.#CSS_CLASS_LINK_ENABLED )
		$links.addClass( EducationHandler.#CSS_CLASS_LINK_DISABLED )
		$links.removeAttr('href')

		this.#enabledMode = false
	}

	#enableOptions() {
		let $links = this.#$rowsEdu.find('td a')

		$links.removeClass( EducationHandler.#CSS_CLASS_LINK_DISABLED )
		$links.addClass( EducationHandler.#CSS_CLASS_LINK_ENABLED )
		$links.attr('href', '#')

		this.#enabledMode = true
	}

	exitDisabledMode() {  // not private because it's called from an external method that handles custom events on the tabs component
		if (this.#enabledMode == false) {
			this.#$btnAuxEdu.trigger('click')  // trigger cancel button while updating an entry, if the user moves to another tab
		}
	}


	/* handle json object  */

	getEducation() {
		let eduList = new Array()

		this.#$rowsEdu.each( function(index) {	
			let nam = $(this).children().eq(EducationHandler.#COL_NAME).text()
			let ins = $(this).children().eq(EducationHandler.#COL_INSTITUTE).text()
			let sta = $(this).children().eq(EducationHandler.#COL_START).text()
			let end = $(this).children().eq(EducationHandler.#COL_END).text()
			
			eduList.push( new Education(nam, ins, sta, end, index) )
		})
		return eduList
	}


	/* row shifts */

	moveRowUp(event) {
		if (this.#enabledMode) { 
			event.preventDefault()

			let size = this.#$rowsEdu.length
			let index = this.#indexFrom(event)
			let firstIndex = this.#$rowsEdu.filter(':first').index()
			
			if (size > 1 && index > firstIndex) {
				let $prevRow = this.#$rowsEdu.eq(index - 1)
				let $currRow = this.#$rowsEdu.eq(index) 

				let prevNam = $prevRow.children().eq( EducationHandler.#COL_NAME ).text()
				let prevIns = $prevRow.children().eq( EducationHandler.#COL_INSTITUTE ).text()
				let prevSta = $prevRow.children().eq( EducationHandler.#COL_START ).text()
				let prevEnd = $prevRow.children().eq( EducationHandler.#COL_END ).text()

				let currNam = $currRow.children().eq( EducationHandler.#COL_NAME ).text()
				let currIns = $currRow.children().eq( EducationHandler.#COL_INSTITUTE ).text()
				let currSta = $currRow.children().eq( EducationHandler.#COL_START ).text()
				let currEnd = $currRow.children().eq( EducationHandler.#COL_END ).text()

				$prevRow.children().eq( EducationHandler.#COL_NAME ).text( currNam )
				$prevRow.children().eq( EducationHandler.#COL_INSTITUTE ).text( currIns )
				$prevRow.children().eq( EducationHandler.#COL_START ).text( currSta )
				$prevRow.children().eq( EducationHandler.#COL_END ).text( currEnd )

				$currRow.children().eq( EducationHandler.#COL_NAME ).text( prevNam )
				$currRow.children().eq( EducationHandler.#COL_INSTITUTE ).text( prevIns )
				$currRow.children().eq( EducationHandler.#COL_START ).text( prevSta )
				$currRow.children().eq( EducationHandler.#COL_END ).text( prevEnd )

				console.log('↑ shift up')
			}
			// else { console.log(JSON.stringify(this.getEducation(), null, 2)) }
		}
	}

	moveRowDown(event) {
		if (this.#enabledMode) { 
			event.preventDefault()

			let size = this.#$rowsEdu.length
			let index = this.#indexFrom(event)
			let lastIndex = this.#$rowsEdu.filter(':last').index()

			if (size > 1 && index < lastIndex) {
				let $currRow = this.#$rowsEdu.eq(index)
				let $nextRow = this.#$rowsEdu.eq(index + 1)

				let currNam = $currRow.children().eq( EducationHandler.#COL_NAME ).text()
				let currIns = $currRow.children().eq( EducationHandler.#COL_INSTITUTE ).text()
				let currSta = $currRow.children().eq( EducationHandler.#COL_START ).text()
				let currEnd = $currRow.children().eq( EducationHandler.#COL_END ).text()

				let nextNam = $nextRow.children().eq( EducationHandler.#COL_NAME ).text()
				let nextIns = $nextRow.children().eq( EducationHandler.#COL_INSTITUTE ).text()
				let nextSta = $nextRow.children().eq( EducationHandler.#COL_START ).text()
				let nextEnd = $nextRow.children().eq( EducationHandler.#COL_END ).text()

				$currRow.children().eq( EducationHandler.#COL_NAME ).text( nextNam )
				$currRow.children().eq( EducationHandler.#COL_INSTITUTE ).text( nextIns )
				$currRow.children().eq( EducationHandler.#COL_START ).text( nextSta )
				$currRow.children().eq( EducationHandler.#COL_END ).text( nextEnd )

				$nextRow.children().eq( EducationHandler.#COL_NAME ).text( currNam )
				$nextRow.children().eq( EducationHandler.#COL_INSTITUTE ).text( currIns )
				$nextRow.children().eq( EducationHandler.#COL_START ).text( currSta )
				$nextRow.children().eq( EducationHandler.#COL_END ).text( currEnd )

				console.log('↓ shift down')
			}
			// else { console.log(JSON.stringify(this.getEducation(), null, 2)) }
		}
	}

}//


class Education {
	constructor(name, institute, start, end, index) {
		this.name = name
		this.institute = institute
		this.start = start
		this.end = end
		this.index = index
	}
}
