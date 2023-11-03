
class SectorHandler
{
	#elForm;
	#elDesc;
	#elIndex;

	#$legend;
	#$btnAux;
	#$btnMain;
	#$tableBody;

	#enabledMode = true;


	static #FORM_LEGEND_INSERT = 'Sector';
	static #FORM_LEGEND_UPDATE = 'Sector [Edici&oacute;n]';

	static #BTN_AUX_CLEAN  = 'Limpiar';
	static #BTN_AUX_CANCEL = 'Anular';

	static #BTN_MAIN_INSERT = 'A&ntilde;adir';
	static #BTN_MAIN_UPDATE = 'Editar';

	static #COL_DESC = 0;
	

	constructor() {
		console.log('\t sector handler');
		this.#loadRefs();
		this.#initCharCounters();
		this.#initAuxBtn();
		this.#initMainBtn();
	}


	#loadRefs() {
		console.log('\t\t references');

		this.#elForm = document.getElementById('formSector');
		this.#elDesc = this.#elForm.elements.sectorDesc;
		this.#elIndex = this.#elForm.elements.sectorIndex;

		this.#$legend = $(this.#elForm).find('legend');
		this.#$btnAux = $(this.#elForm.elements.btnAuxSector);
		this.#$btnMain = $(this.#elForm.elements.btnMainSector);
		this.#$tableBody = $('table#tableSector tbody');
	}

	#initCharCounters() {
		console.log('\t\t character counters');
		FormUtil.initCharCounters(this.#elForm);
	}

    #initAuxBtn() {
    	console.log('\t\t aux button');
    	this.#$btnAux.on('click', event => { 
        	event.preventDefault();
			if (event.target.textContent === SectorHandler.#BTN_AUX_CANCEL) {
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
			if (event.target.textContent === SectorHandler.#BTN_MAIN_UPDATE) 
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
				<td><a href="#" onclick="sectorHandler.moveUp(event)">&bigtriangleup;</a></td>
				<td><a href="#" onclick="sectorHandler.moveDown(event)">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="sectorHandler.select(event)">Editar</a></td>
	            <td><a href="#" onclick="sectorHandler.remove(event)">Eliminar</a></td>
	        </tr>`;
	        this.#$tableBody.append(newRow);
			FormUtil.reset(this.#elForm);

			let index = this.#$tableBody.children().length - 1;
			console.log(`[sector] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBody.children().eq(index).children();

			this.#elDesc.value = $row.eq(SectorHandler.#COL_DESC).text(); this.#elDesc.focus();
			this.#elIndex.value = index;

			this.#disableOptions();
			console.log(`[sector] row ${index} selected!`);
		}
	}

	#update() {
		let index = this.#elIndex.value;

		if (this.#isValidForm()) {
			let updatedRow = 
			`<td>${this.#elDesc.value}</td>
			 <td><a href="#" onclick="sectorHandler.moveUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="sectorHandler.moveDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="sectorHandler.select(event)">Editar</a></td>
	         <td><a href="#" onclick="sectorHandler.remove(event)">Eliminar</a></td>`;
			 
			this.#$tableBody.children().eq(index).html(updatedRow);

			this.#formInInsertMode();
			FormUtil.reset(this.#elForm);
			this.#enableOptions();

			console.log(`[sector] row ${index} updated!`);
		}
	}

	remove(event) {  
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.#$tableBody.children().eq(index);
			let desc = $row.children().eq(SectorHandler.#COL_DESC).text();

			if (confirm(`Confirma eliminaci\xF3n de "${desc}"`)) {
				$row.remove();
				console.log(`[sector] row ${index} removed!`);
			}
		}
	}


	#isValidForm() {
		return Validator.isInputNotEmpty(this.#elDesc);
	}


	#formInInsertMode() {
		this.#$legend.html(SectorHandler.#FORM_LEGEND_INSERT);
		this.#$btnAux.html(SectorHandler.#BTN_AUX_CLEAN);
		this.#$btnMain.html(SectorHandler.#BTN_MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$legend.html(SectorHandler.#FORM_LEGEND_UPDATE);
		this.#$btnAux.html(SectorHandler.#BTN_AUX_CANCEL);
		this.#$btnMain.html(SectorHandler.#BTN_MAIN_UPDATE);
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


	getSectors() {
		let sectorList = new Array();
		this.#$tableBody.children().each( function(idx) {	
			let desc = $(this).children().eq(SectorHandler.#COL_DESC).text();
			sectorList.push( new Sector(desc, idx) );
		});
		return sectorList;
	}

}//

