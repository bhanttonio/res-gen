
class EducationB {
    name; institute; start; end; index;
    constructor() { }
}


class Handler 
{
    form;
    table;
    insertMode = true;   // controls the mode of the form    

    constructor() {
        if (this.constructor == Handler)
			throw new Error('Abstract class must be implemented!');

        let formConfig  = this.formConfig();
        let tableConfig = this.tableConfig()
        console.log(`\t ${tableConfig.handlerName}`);

        this.form  = new FormComponent(formConfig);
        this.table = new TableComponent(tableConfig);

        this.initCharCounters();
		this.initAuxBtn();
		this.initMainBtn();
    }

    formConfig() {
        throw new Error('Abstract method must be implemented!');
    }

    tableConfig() {
        throw new Error('Abstract method must be implemented!');
    }
 
    initCharCounters() {
		this.form.initCharCounters(this.elForm);
	}

	initAuxBtn() {
    	this.form.$btnAux.on('click', event => {
        	event.preventDefault();
			if (event.target.textContent === FormComponent.AUX_CANCEL) {
				this.form.toInsertMode();
				this.enableOptions();
			}
			this.form.reset();
			event.target.blur();
    	});
    }

	initMainBtn() {
    	this.form.$btnMain.on('click', event => {
	        event.preventDefault();
			if (event.target.textContent === FormComponent.MAIN_UPDATE) 
				this.update();
			else 
				this.insert();
			event.target.blur();
	    });
    }

    insert() {
		if (this.isValidForm()) {
            this.table.insertRow( this.form.fieldArray );
			this.form.resetForm();

			console.log(`[${this.table.handlerName}] row ${this.table.rowsNumber - 1} inserted!`);
	    }
	}

    isValidForm() {
        throw new Error('Abstract method must be implemented!');
	}

    select(event) { 
		if (this.insertMode) {
			event.preventDefault();
            let rowIndex = this.table.rowIndexFrom(event);
            let $tds = this.table.$tds(rowIndex);

            this.form.fillWith($tds, rowIndex);
            this.form.toUpdateMode();
			this.disableOptions();

			console.log(`[${this.table.handlerName}] row ${rowIndex} selected!`);
		}
	}

    update() {
		if (this.isValidForm()) {
            let rowIndex = this.form.elIndex.value;
            this.table.updateRow(this.form.fieldArray, rowIndex);
			this.form.reset();
            this.form.toInsertMode();
			this.enableOptions();

			console.log(`[${this.table.handlerName}] row ${rowIndex} updated!`);
		}
	}

    remove(event) {
		if (this.insertMode) {
			event.preventDefault();
			let rowIndex = this.table.rowIndexFrom(event);
            let refName = this.table.referenceName(rowIndex);

			if (confirm(`Se eliminar\xE1 "${refName}"`)) {
				this.table.deleteRow(rowIndex);
				console.log(`[${this.table.handlerName}] row ${rowIndex} removed!`);
			}
		}
	}

    exitEditMode() {
		if (this.insertMode == false)
            this.form.cancelUpdate();
	}

    disableOptions() {
		this.table.disableOptions();
		this.insertMode = false;
	}

	enableOptions() {
		this.table.enableOptions();
		this.insertMode = true;
	}

    moveUp(event) {
        event.preventDefault();
		if (this.insertMode) 
			this.table.moveRowUp(event);
	}

    moveDown(event) {
        event.preventDefault();
		if (this.insertMode)
			this.table.moveRowDown(event);
	}

}//


class EducationHandlerB extends Handler 
{

    constructor() { 
        super(); 
    }

    formConfig() {
        return {
            elForm: document.getElementById('formEdu'), 
            elIndex: document.getElementById('indexEdu'), 
            fields: [document.getElementById('nameEdu'), 
                     document.getElementById('instituteEdu'), 
                     document.getElementById('startEdu'), 
                     document.getElementById('endEdu')],
            formLegend: 'Escolaridad', 
            insertLegend: 'Nueva', 
            $legend: $('#formEdu').find('legend'),
	        $btnAux: $('#btnAuxEdu'),
	        $btnMain: $('#btnMainEdu')
        };
    }

    tableConfig() {
        return {
            $tableBody: $('table#tableEdu tbody'), 
            handlerName: 'educationHandler', 
            objectType: EducationB
        };
    }

    isValidForm() {
        return Validator.isInputNotEmpty(this.form.indexEdu) * 
               Validator.isInputNotEmpty(this.form.instituteEdu) * 
               Validator.isYearRangeValid(this.form.startEdu, this.form.endEdu);
    }

}//
