
class Handler 
{
    static INDEX = 0;   // index of index field

    form;
    table;
    insertMode = true;   // controls the mode of the form

    constructor(form, table, tableData) {
        if (this.constructor == Handler)
			throw new Error('Abstract class must be implemented!');

        console.log(`\t ${table.handler}`);
        this.form  = form;
        this.table = table;

        this.initCharCounters();
		this.initAuxBtn();
		this.initMainBtn();
		this.initTable(tableData);
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

	initTable(tableData) {
		if (tableData && tableData.length > 0)
			this.table.load(tableData);
	}

    insert() {
		if (this.isValidForm()) {
            this.table.insert(this.form.values());
			this.form.reset();

            let index = this.table.size() - 1;
			console.log(`[${this.table.handler}] row ${index} inserted!`);
	    }
	}

    isValidForm() {
        throw new Error('Abstract method must be implemented!');
	}

    select(event) { 
		if (this.insertMode) {
			event.preventDefault();
            let index = this.table.indexFrom(event);

            let values = this.table.tdValues(index);   // values = index value + td values
            values.unshift(index);                     // add index value at the very beginning

            this.form.toUpdateMode();
            this.form.fillWith(values);
			this.disableOptions();

			console.log(`[${this.table.handler}] row ${index} selected!`);
		}
	}

    update() {
		if (this.isValidForm()) {
            let index = this.form.fields[Handler.INDEX].value;
            this.table.update(this.form.values(), index);

            this.form.toInsertMode();
			this.form.reset();
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

    disableOptions() {
		this.table.disableOptions();
		this.insertMode = false;
	}

	enableOptions() {
		this.table.enableOptions();
		this.insertMode = true;
	}

    exitEditMode() {
		if (this.insertMode == false)
            this.form.cancelUpdate();
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

	tableData() {
        return this.table.data();
    }
    
}//
