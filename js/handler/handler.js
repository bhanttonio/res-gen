
class EducationB {
    name; institute; start; end;
    constructor() { }
}


class Handler 
{
    form;
    table;
    insertMode = true;   // controls the mode of the form    

    constructor(formConfig, tableConfig) {
        if (this.constructor == Handler)
			throw new Error('Abstract class must be implemented!');

        console.log(`\t ${tableConfig.handlerName}`);
        this.form  = new Form(formConfig);
        this.table = new Table(tableConfig);

        this.initCharCounters();
		this.initAuxBtn();
		this.initMainBtn();
    }
 
    initCharCounters() {
		this.form.initCharCounters();
	}

	initAuxBtn() {
    	this.form.$btnAux.on('click', event => {
        	event.preventDefault();
			if (event.target.textContent === Form.AUX_CANCEL) {
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
			if (event.target.textContent === Form.MAIN_UPDATE) 
				this.update();
			else 
				this.insert();
			event.target.blur();
	    });
    }

    insert() {
		if (this.isValidForm()) {
            this.table.insert(this.form.values());
			this.form.reset();
			console.log(`[${this.table.handler}] row ${this.table.size() - 1} inserted!`);
	    }
	}

    isValidForm() {
        throw new Error('Abstract method must be implemented!');
	}

    select(event) { 
		if (this.insertMode) {
			event.preventDefault();

            let index = this.table.indexFrom(event);
            let values = this.table.tdValues(index);
            values.unshift(index);

            this.form.fillWith(values);
            this.form.toUpdateMode();
			this.disableOptions();

			console.log(`[${this.table.handler}] row ${index} selected!`);
		}
	}

    update() {
		if (this.isValidForm()) {
            let index = this.fields[0].value;
            this.table.update(this.form.values(), index);

			this.form.reset();
            this.form.toInsertMode();
			this.enableOptions();

			console.log(`[${this.table.handler}] row ${index} updated!`);
		}
	}

    remove(event) {
		if (this.insertMode) {
			event.preventDefault();
			let index = this.table.indexFrom(event);
            let refName = this.table.referenceName(index);

			if (confirm(`Se eliminar\xE1 "${refName}"`)) {
				this.table.delete(index);
				console.log(`[${this.table.handler}] row ${index} removed!`);
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
			this.table.moveUp(event);
	}

    moveDown(event) {
        event.preventDefault();
		if (this.insertMode)
			this.table.moveDown(event);
	}

}//


class EducationHandlerB extends Handler 
{
    constructor() { 
        super({ 
                elForm: document.getElementById('formEdu'),
                insertLegend: 'Nueva' 
            }, {
                $tableBody: $('table#tableEdu tbody'),
                handler: 'educationHandler', 
                object: new EducationB()
            }
        ); 
    }

    isValidForm() {
        return Validator.isInputNotEmpty(this.form.elForm.nameEdu) * 
               Validator.isInputNotEmpty(this.form.elForm.instituteEdu) * 
               Validator.isYearRangeValid(this.form.elForm.startEdu, this.form.elForm.endEdu);
    }

}//
