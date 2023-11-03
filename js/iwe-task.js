

class IweTaskHandler 
{
    #elForm;
	#elDesc;
	#elIndex;

    #$label;
	#$linkAux;
	#$linkMain;
	#$tableBody;

    #enabledMode = true;


	static #LABEL_INSERT = 'Descripci&oacute;n';
	static #LABEL_UPDATE = 'Descripci&oacute;n [Edici&oacute;n]';

	static #AUX_CLEAN  = 'Limpiar';
	static #AUX_CANCEL = 'Anular';
	static #MAIN_INSERT = 'A&ntilde;adir';
	static #MAIN_UPDATE = 'Editar';

	static #COL_DESC = 0;


    constructor() {
        console.log('\t iwe task handler');
        this.#loadRefs();
		this.#initCharCounters();
		this.#initAuxLink();
		this.#initMainLink();
    }

    #loadRefs() {
        console.log('\t\t references');

		this.#elForm = document.getElementById('formIweTask');
		this.#elDesc = this.#elForm.elements.iweTaskDesc;
		this.#elIndex = this.#elForm.elements.iweTaskIndex;

        this.#$label = $('#iweTaskLabel');
		this.#$linkAux = $('#linkAuxIweTask');
		this.#$linkMain = $('#linkMainIweTask');
		this.#$tableBody = $('table#tableIweTask tbody');
	}

	#initCharCounters() {
        console.log('\t\t character counters');
		FormUtil.initCharCounters(this.#elForm);
	}

    #initAuxLink() {
        console.log('\t\t aux button');
    	this.#$linkAux.on('click', event => { 
        	event.preventDefault();
			if (event.target.textContent === IweTaskHandler.#AUX_CANCEL) {
				this.#formInInsertMode();
				this.#enableOptions();
			}
			FormUtil.reset(this.#elForm);
			event.target.blur();
    	});
    }

    #initMainLink() {
        console.log('\t\t main button');
    	this.#$linkMain.on('click', event => {
	        event.preventDefault();
			if (event.target.textContent === IweTaskHandler.#MAIN_UPDATE) 
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
				<td><a href="#" onclick="iweTaskHandler.moveUp(event)" title="subir">&bigtriangleup;</a></td>
				<td><a href="#" onclick="iweTaskHandler.moveDown(event)" title="bajar">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="iweTaskHandler.select(event)" title="editar">&#x1F589;</a></td>
	            <td><a href="#" onclick="iweTaskHandler.remove(event)" title="borrar">&#x2327;</a></td>
	        </tr>`;
	        this.#$tableBody.append(newRow);
			FormUtil.reset(this.#elForm);

			let index = this.#$tableBody.children().length - 1;
			console.log(`[iwe task] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBody.children().eq(index).children();

			this.#elDesc.value = $row.eq(IweTaskHandler.#COL_DESC).text(); this.#elDesc.focus();
			this.#elIndex.value = index;

			this.#disableOptions();
			console.log(`[iwe task] row ${index} selected!`);
		}
	}

	#update() {
		let index = this.#elIndex.value;

		if (this.#isValidForm()) {
			let updatedRow = 
			`<td>${this.#elDesc.value}</td>
			 <td><a href="#" onclick="iweTaskHandler.moveUp(event)" title="subir">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="iweTaskHandler.moveDown(event)" title="bajar">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="iweTaskHandler.select(event)" title="editar">&#x1F589;</a></td>
	         <td><a href="#" onclick="iweTaskHandler.remove(event)" title="borrar">&#x2327;</a></td>`;
			 
			this.#$tableBody.children().eq(index).html(updatedRow);

			this.#formInInsertMode();
			FormUtil.reset(this.#elForm);
			this.#enableOptions();

			console.log(`[iwe task] row ${index} updated!`);
		}
	}

	remove(event) {  
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.#$tableBody.children().eq(index);
			let desc = $row.children().eq(IweTaskHandler.#COL_DESC).text();

			if (confirm(`Confirma eliminaci\xF3n de "${desc}"`)) {
				$row.remove();
				console.log(`[iwe task] row ${index} removed!`);
			}
		}
	}

	#isValidForm() {
		return Validator.isInputNotEmpty(this.#elDesc);
	}


    #formInInsertMode() {
		this.#$label.html(IweTaskHandler.#LABEL_INSERT);
		this.#$linkAux.html(IweTaskHandler.#AUX_CLEAN);
		this.#$linkMain.html(IweTaskHandler.#MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$label.html(IweTaskHandler.#LABEL_UPDATE);
		this.#$linkAux.html(IweTaskHandler.#AUX_CANCEL);
		this.#$linkMain.html(IweTaskHandler.#MAIN_UPDATE);
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
			this.#$linkAux.trigger('click');
	}


    moveUp(event) {
		if (this.#enabledMode)
			TableUtil.moveRowUp(this.#$tableBody, event);
	}

	moveDown(event) {
		// console.log(JSON.stringify(this.getTasks(), null, 2));
		if (this.#enabledMode) 
			TableUtil.moveRowDown(this.#$tableBody, event);
	}


	getTasks() {
		let taskList = new Array();
		this.#$tableBody.children().each( function(idx) {	
			let desc = $(this).children().eq(IweTaskHandler.#COL_DESC).text();
			taskList.push( new Task(desc, idx) );
		});
		return taskList;
	}

} 

