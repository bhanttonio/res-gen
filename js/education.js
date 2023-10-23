
class EducationHandler
{
	#elFormEdu
	#elEduName
	#elEduInstitute
	#elEduStart
	#elEduEnd
	#elEduIndex

	#$legend
	#$btnAuxEdu
	#$btnMainEdu
	#$tableEduBody

	static #FORM_LEGEND_INSERT = 'Escolaridad'
	static #FORM_LEGEND_UPDATE = 'Escolaridad [Editar]'
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
		this.#elFormEdu = document.getElementById('form-education')
		this.#elEduName = document.getElementById('edu_name')
		this.#elEduInstitute = document.getElementById('edu_institute')
	    this.#elEduStart = document.getElementById('edu_start')
		this.#elEduEnd = document.getElementById('edu_end')
		this.#elEduIndex = document.getElementById('edu_index')

		this.#$legend = $('form#form-education').find('legend')
		this.#$btnAuxEdu = $('button#btn-aux-edu')
		this.#$btnMainEdu = $('button#btn-main-edu')
		this.#$tableEduBody = $('table#table-edu tbody')
	}

	#setUpCharacterCounters() {
		$('input#edu_start, input#edu_end, input#edu_name, input#edu_institute').characterCounter()
	}

    #setUpAuxButton() {
    	console.log('\t\t aux button')
		let _this = this
    	this.#$btnAuxEdu.on('click', function(e) {
        	e.preventDefault()
			if (this.textContent === EducationHandler.#BTN_AUX_CANCEL) {
				_this.#formInInsertMode()
			}
			_this.#resetForm()
			this.blur()
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
			_this.#resetForm()
	        this.blur()
	    })
    }

	#insertEducation() {
	    let name = this.#elEduName.value.trim()
	    let institute = this.#elEduInstitute.value.trim()
	    let start = this.#elEduStart.value.trim()
	    let end = this.#elEduEnd.value.trim()

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

		this.#elEduStart.value = period[0]; this.#elEduStart.focus()
		this.#elEduEnd.value = period[1]; this.#elEduEnd.focus()
		this.#elEduInstitute.value = $row.eq(EducationHandler.#COL_INSTITUTE).text(); this.#elEduInstitute.focus()
		this.#elEduName.value = $row.eq(EducationHandler.#COL_NAME).text(); this.#elEduName.focus()
		this.#elEduIndex.value = index
	}

	#updateEducation() {
		let name = this.#elEduName.value.trim()
	    let institute = this.#elEduInstitute.value.trim()
	    let start = this.#elEduStart.value.trim()
	    let end = this.#elEduEnd.value.trim()
		let index = this.#elEduIndex.value.trim()

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

	#resetForm() {
		this.#elFormEdu.reset()
		this.#setUpCharacterCounters()
	}

	#formInInsertMode() {
		this.#$legend.text(EducationHandler.#FORM_LEGEND_INSERT)
		this.#$btnAuxEdu.text(EducationHandler.#BTN_AUX_CLEAN)
		this.#$btnMainEdu.html(EducationHandler.#BTN_MAIN_INSERT)
	}

	#formInUpdateMode() {
		this.#$legend.text(EducationHandler.#FORM_LEGEND_UPDATE)
		this.#$btnAuxEdu.text(EducationHandler.#BTN_AUX_CANCEL)
		this.#$btnMainEdu.text(EducationHandler.#BTN_MAIN_UPDATE)
	}

}//

