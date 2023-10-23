
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

	static #FORM_LEGEND_INSERT = 'Escolaridad'
	static #FORM_LEGEND_UPDATE = 'Escolaridad [Edici&oacute;n]'
	static #BTN_AUX_CLEAN = 'Limpiar'
	static #BTN_AUX_CANCEL = 'Cancelar'
	static #BTN_MAIN_INSERT = 'A&ntilde;adir'
	static #BTN_MAIN_UPDATE = 'Editar'
	static #COL_PERIOD = 0
	static #COL_NAME = 1
	static #COL_INSTITUTE = 2
	
	constructor() {
		console.log('\t education handler')
		this.#loadRefs()
		this.#setUpCharacterCounters()
		this.#setUpAuxButton()
		this.#setUpMainButton()
	}

	#loadRefs() {
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
	}

	#setUpCharacterCounters() {
		$(this.#eduName).characterCounter()
		$(this.#eduInstitute).characterCounter()
		$(this.#eduStart).characterCounter()
		$(this.#eduEnd).characterCounter()
	}

    #setUpAuxButton() {
    	console.log('\t\t aux button')
		let _this = this
    	this.#$btnAuxEdu.on('click', function(e) {
        	e.preventDefault()
			if (this.textContent === EducationHandler.#BTN_AUX_CANCEL) {
				_this.#formInInsertMode()
			}
			_this.#resetForm(this)
    	})
    }

    #setUpMainButton() {
    	console.log('\t\t main button')
		let _this = this
    	this.#$btnMainEdu.on('click', function(e) {
	        e.preventDefault()
			if (this.textContent === EducationHandler.#BTN_MAIN_UPDATE) {
				_this.#updateEducation()
				_this.#formInInsertMode()
			}
			else {
				_this.#insertEducation()
			}
			_this.#resetForm(this)
	    })
    }

	#insertEducation() {
	    let name = this.#eduName.value.trim()
	    let institute = this.#eduInstitute.value.trim()
	    let start = this.#eduStart.value.trim()
	    let end = this.#eduEnd.value.trim()

	    if (name && institute && start && end) {
			let index = this.#$tableEduBody.children().length
	        let newRow = 
	        `<tr>
	            <td>${start}-${end}</td>
	            <td>${name}</td>
	            <td>${institute}</td>
	            <td><a href="#" onclick="educationHandler.selectEducation(event, ${index})">Editar</a></td>
	            <td><a href="#" onclick="educationHandler.removeEducation(event, ${index})">Eliminar</a></td>
	        </tr>`
	        this.#$tableEduBody.append(newRow)
	    }
	}

	selectEducation(event, index) {
		console.log(`# select education row [${index}]`)
		event.preventDefault()

		this.#formInUpdateMode()

		let $row = this.#$tableEduBody.children().eq(index).children()
		let period = $row.eq(EducationHandler.#COL_PERIOD).text().split('-')

		this.#eduStart.value = period[0]; this.#eduStart.focus()
		this.#eduEnd.value = period[1]; this.#eduEnd.focus()
		this.#eduInstitute.value = $row.eq(EducationHandler.#COL_INSTITUTE).text(); this.#eduInstitute.focus()
		this.#eduName.value = $row.eq(EducationHandler.#COL_NAME).text(); this.#eduName.focus()
		this.#eduIndex.value = index
	}

	#updateEducation() {
		let name = this.#eduName.value.trim()
	    let institute = this.#eduInstitute.value.trim()
	    let start = this.#eduStart.value.trim()
	    let end = this.#eduEnd.value.trim()
		let index = this.#eduIndex.value.trim()

	    if (name && institute && start && end) {
			let updatedRow = 
			`<td>${start}-${end}</td>
	         <td>${name}</td>
	         <td>${institute}</td>
	         <td><a href="#" onclick="educationHandler.selectEducation(event, ${index})">Editar</a></td>
	         <td><a href="#" onclick="educationHandler.removeEducation(event, ${index})">Eliminar</a></td>`
			this.#$tableEduBody.children().eq(index).html(updatedRow)
		}
	}

	removeEducation(event, index) {
		event.preventDefault()
		let $row = this.#$tableEduBody.children().eq(index)
		let eduName = $row.children().eq(EducationHandler.#COL_NAME).text()

		if (confirm(`Confirma eliminaci\xF3n de '${eduName}'`))
			$row.hide()
	}

	#resetForm($button) {
		this.#formEdu.reset()
		this.#setUpCharacterCounters()
		$button.blur()
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

}//

