
class Handler 
{
    static #INDEX = 0;    // index of index field

    form;
    table;
    insertMode = true;   // to control mode of the form
	handlerName;

    constructor(config) {
        if (this.constructor == Handler)
			throw new Error('Abstract class must be implemented!');

		this.handlerName = config.handlerName;
		console.log(`\t ${this.handlerName}`);
		
        this.form  = config.form;
        this.table = config.table;

		this.initAuxBtn();
		this.initMainBtn();
		this.initTable(config.data);
    }

	initAuxBtn() {
    	this.form.$btnAux.on('click', event => {
        	event.preventDefault();
			if (!this.insertMode)
				this.toInsertMode();
			else
				this.form.reset();
			event.target.blur();
    	});
    }

	initMainBtn() {
    	this.form.$btnMain.on('click', event => {
	        event.preventDefault();
			if (!this.insertMode) 
				this.update();
			else 
				this.insert();
			event.target.blur();
	    });
    }

	initTable(data) {
		if (data && data.length > 0)
			this.table.load(data);
	}

    insert() {
		if (this.isValidForm()) {
            this.table.insert( this.form.values() );
			this.form.reset();

            let index = this.table.size() - 1;
			console.log(`[${this.handlerName}] row ${index} inserted!`);
	    }
	}

    isValidForm() {
        throw new Error('Abstract method must be implemented!');
	}

    select(event) { 
		if (this.insertMode) {
			event.preventDefault();
			this.toEditMode();

            let index = this.table.indexFrom(event);
			let values = [index, ...this.table.tdValues(index)];   // values = index + td values
            this.form.fillWith(values);

			console.log(`[${this.handlerName}] row ${index} selected!`);
		}
	}

    update() {
		if (this.isValidForm()) {
            let index = this.form.fields[Handler.#INDEX].value;
            this.table.update(this.form.values(), index);

            this.toInsertMode();
			console.log(`[${this.handlerName}] row ${index} updated!`);
		}
	}

    remove(event) {
		if (this.insertMode) {
			event.preventDefault();
			let index = this.table.indexFrom(event);
            let refName = this.table.referenceName(index);

			if (confirm(`Se eliminar\xE1 "${refName}"`)) {
				this.table.delete(index);
				console.log(`[${this.handlerName}] row ${index} removed!`);
			}
		}
	}

	toInsertMode() {
		this.form.toInsertMode();
		this.table.enableOptions();
		this.insertMode = true;
	}

    toEditMode() {
		this.form.toEditMode();
		this.table.disableOptions();
		this.insertMode = false;
	}

    exitEditMode() {
		if (this.insertMode == false)
            this.toInsertMode();
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

