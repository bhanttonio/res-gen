
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
	#$tableEduBody

	#enabledMode = true   // to control enabled (insertion) and disabled (updating) modes of table's links


	static #FORM_LEGEND_INSERT = 'Escolaridad'
	static #FORM_LEGEND_UPDATE = 'Escolaridad [Edici&oacute;n]'

	static #BTN_AUX_CLEAN = 'Limpiar'
	static #BTN_AUX_CANCEL = 'Cancelar'

	static #BTN_MAIN_INSERT = 'A&ntilde;adir'
	static #BTN_MAIN_UPDATE = 'Editar'

	static #COL_PERIOD = 0
	static #COL_NAME = 1
	static #COL_INSTITUTE = 2

	static #CSS_CLASS_ROW_REMOVED = 'resgen-removed'
	static #CSS_CLASS_LINK_ENABLED = 'resgen-enabled'
	static #CSS_CLASS_LINK_DISABLED = 'resgen-disabled'

	static #ROWS_SELECTOR   // selector for active (not deleted) rows in the table
	

	constructor() {
		console.log('\t education handler')

		this.#loadRefs()
		this.#setUpCharCounters()
		this.#setUpAuxButton()
		this.#setUpMainButton()
	}


	// config methods

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
		this.#$tableEduBody = $('table#tableEdu tbody')

		EducationHandler.#ROWS_SELECTOR = `tr:not(".${EducationHandler.#CSS_CLASS_ROW_REMOVED}") td a` 
	}

	#setUpCharCounters() {
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


	// crud operations

	#insertEducation() {
	    let name = this.#eduName.value.trim()
	    let institute = this.#eduInstitute.value.trim()
	    let start = this.#eduStart.value.trim()
	    let end = this.#eduEnd.value.trim()

		if ( this.#isValidForm(name, institute, start, end) ) {
			let index = this.#$tableEduBody.children().length
	        let newRow = 
	        `<tr>
	            <td>${start}-${end}</td>
	            <td>${name}</td>
	            <td>${institute}</td>
				<td><a href="#">&bigtriangleup;</a></td>
				<td><a href="#">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="educationHandler.selectEducation(event, ${index})">Editar</a></td>
	            <td><a href="#" onclick="educationHandler.removeEducation(event, ${index})">Eliminar</a></td>
	        </tr>`
	        this.#$tableEduBody.append(newRow)

			this.#resetForm()   // clean form only if everything was ok 
	    }
		// console.log( JSON.stringify(this.getEducation(), null, 2) )
	}

	selectEducation(event, index) {   // not a private method because it's called from the links in the table
		if (this.#enabledMode)   // select entry only if no update is in progress
		{
			console.log(`# select edu row [${index}]`)
			event.preventDefault()

			this.#formInUpdateMode()

			let $row = this.#$tableEduBody.children().eq(index).children()
			let period = $row.eq(EducationHandler.#COL_PERIOD).text().split('-')

			this.#eduStart.value = period[0]; this.#eduStart.focus()
			this.#eduEnd.value = period[1]; this.#eduEnd.focus()
			this.#eduInstitute.value = $row.eq(EducationHandler.#COL_INSTITUTE).text(); this.#eduInstitute.focus()
			this.#eduName.value = $row.eq(EducationHandler.#COL_NAME).text(); this.#eduName.focus()
			this.#eduIndex.value = index

			this.#disableOptions()   // disable links in the table, while updating an entry
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
			`<td>${start}-${end}</td>
	         <td>${name}</td>
	         <td>${institute}</td>
			 <td><a href="#">&bigtriangleup;</a></td>
			 <td><a href="#">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="educationHandler.selectEducation(event, ${index})">Editar</a></td>
	         <td><a href="#" onclick="educationHandler.removeEducation(event, ${index})">Eliminar</a></td>`
			 
			this.#$tableEduBody.children().eq(index).html(updatedRow)

			this.#formInInsertMode()  // after an update, return form to insert mode, clean it and enable links in the table
			this.#resetForm()
			this.#enableOptions()
		}
	}

	removeEducation(event, index) {   // not a private method because it's called from the links in the table
		if (this.#enabledMode)   // remove entry only if no update is in progress
		{
			event.preventDefault()
			let $row = this.#$tableEduBody.children().eq(index)
			let eduName = $row.children().eq(EducationHandler.#COL_NAME).text()

			if (confirm(`Confirma eliminaci\xF3n de '${eduName}'`)) {
				$row.addClass( EducationHandler.#CSS_CLASS_ROW_REMOVED )
				$row.hide()
			}
		}
	}


	// form validation

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


	// handle insert and updating modes of the form

	#resetForm() {
		this.#formEdu.reset()
		this.#setUpCharCounters()
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


	// handle enabled and disabled modes of the links in the table

	#disableOptions() {
		let $links = this.#$tableEduBody.find( EducationHandler.#ROWS_SELECTOR )
		//for (let i = 0; i < $links.length; i++) console.log( $links[i] )
		
		$links.removeClass( EducationHandler.#CSS_CLASS_LINK_ENABLED )
		$links.addClass( EducationHandler.#CSS_CLASS_LINK_DISABLED )
		$links.removeAttr('href')

		this.#enabledMode = false
	}

	#enableOptions() {
		let $links = this.#$tableEduBody.find( EducationHandler.#ROWS_SELECTOR )

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

	getEducation() {
		let eduList = new Array()
		let $activeRows = this.#$tableEduBody.find(`tr:not(".${EducationHandler.#CSS_CLASS_ROW_REMOVED}")`)

		$activeRows.each( function(index) {
			let $row = $(this).children()

			let name = $row.eq(EducationHandler.#COL_NAME).text()
			let institute = $row.eq(EducationHandler.#COL_INSTITUTE).text()
			let period = $row.eq(EducationHandler.#COL_PERIOD).text().split('-')
			let start = period[0]
			let end = period[1]

			eduList.push( new Education(name, institute, start, end) )
		})

		return eduList
	}

}//


class Education {
	constructor(name, institute, start, end) {
		this.name = name
		this.institute = institute
		this.start = start
		this.end = end
	}
}
