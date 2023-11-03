
class SkillHandler
{
	#elForm;
	#elDesc;
	#elIndex;

	#$legend;
	#$btnAux;
	#$btnMain;
	#$tableBody;

	#enabledMode = true;


	static #FORM_LEGEND_INSERT = 'Conocimiento';
	static #FORM_LEGEND_UPDATE = 'Conocimiento [Edici&oacute;n]';

	static #BTN_AUX_CLEAN  = 'Limpiar';
	static #BTN_AUX_CANCEL = 'Anular';

	static #BTN_MAIN_INSERT = 'A&ntilde;adir';
	static #BTN_MAIN_UPDATE = 'Editar';

	static #COL_DESC = 0;
	

	constructor() {
		console.log('\t skill handler');
		this.#loadRefs();
		this.#initCharCounters();
		this.#initAuxBtn();
		this.#initMainBtn();
	}


	#loadRefs() {
		console.log('\t\t references');

		this.#elForm = document.getElementById('formSkill');
		this.#elDesc = this.#elForm.elements.skillDesc;
		this.#elIndex = this.#elForm.elements.skillIndex;

		this.#$legend = $(this.#elForm).find('legend');
		this.#$btnAux = $(this.#elForm.elements.btnAuxSkill);
		this.#$btnMain = $(this.#elForm.elements.btnMainSkill);
		this.#$tableBody = $('table#tableSkill tbody');
	}

	#initCharCounters() {
		console.log('\t\t character counters');
		FormUtil.initCharCounters(this.#elForm);
	}

    #initAuxBtn() {
    	console.log('\t\t aux button');
    	this.#$btnAux.on('click', event => { 
        	event.preventDefault();
			if (event.target.textContent === SkillHandler.#BTN_AUX_CANCEL) {
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
			if (event.target.textContent === SkillHandler.#BTN_MAIN_UPDATE) 
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
	            <td>${this.#elDesc.value}</td>
				<td><a href="#" onclick="skillHandler.moveUp(event)">&bigtriangleup;</a></td>
				<td><a href="#" onclick="skillHandler.moveDown(event)">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="skillHandler.select(event)">Editar</a></td>
	            <td><a href="#" onclick="skillHandler.remove(event)">Eliminar</a></td>
	        </tr>`;
	        this.#$tableBody.append(newRow);
			FormUtil.reset(this.#elForm);

			let index = this.#$tableBody.children().length - 1;
			console.log(`[skill] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBody.children().eq(index).children();

			this.#elDesc.value = $row.eq(SkillHandler.#COL_DESC).text(); this.#elDesc.focus();
			this.#elIndex.value = index;

			this.#disableOptions();
			console.log(`[skill] row ${index} selected!`);
		}
	}

	#update() {
		let index = this.#elIndex.value;

		if (this.#isValidForm()) {
			let updatedRow = 
			`<td>${this.#elDesc.value}</td>
			 <td><a href="#" onclick="skillHandler.moveUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="skillHandler.moveDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="skillHandler.select(event)">Editar</a></td>
	         <td><a href="#" onclick="skillHandler.remove(event)">Eliminar</a></td>`;
			 
			this.#$tableBody.children().eq(index).html(updatedRow);

			this.#formInInsertMode();
			FormUtil.reset(this.#elForm);
			this.#enableOptions();

			console.log(`[skill] row ${index} updated!`);
		}
	}

	remove(event) {  
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.#$tableBody.children().eq(index);
			let desc = $row.children().eq(SkillHandler.#COL_DESC).text();

			if (confirm(`Confirma eliminaci\xF3n de "${desc}"`)) {
				$row.remove();
				console.log(`[skill] row ${index} removed!`);
			}
		}
	}


	#isValidForm() {
		return Validator.isInputNotEmpty(this.#elDesc);
	}


	#formInInsertMode() {
		this.#$legend.html(SkillHandler.#FORM_LEGEND_INSERT);
		this.#$btnAux.html(SkillHandler.#BTN_AUX_CLEAN);
		this.#$btnMain.html(SkillHandler.#BTN_MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$legend.html(SkillHandler.#FORM_LEGEND_UPDATE);
		this.#$btnAux.html(SkillHandler.#BTN_AUX_CANCEL);
		this.#$btnMain.html(SkillHandler.#BTN_MAIN_UPDATE);
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
			TableUtil.moveRowUp(this.#$tableBody, event);
	}

	moveDown(event) {
		if (this.#enabledMode) 
			TableUtil.moveRowDown(this.#$tableBody, event);
	}


	getSkills() {
		let skillList = new Array();
		this.#$tableBody.children().each( function(idx) {	
			let desc = $(this).children().eq(SkillHandler.#COL_DESC).text();
			skillList.push( new Skill(desc, idx) );
		});
		return skillList;
	}

}//

