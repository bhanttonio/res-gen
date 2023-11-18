
class Handler 
{
    static INDEX = 0;    // index of index field

    form;
    table;
    insertMode = true;   // to control mode of the form
	handlerName;

    constructor(form, table, data) {
        if (this.constructor == Handler)
			throw new Error('Abstract class must be implemented!');

		console.log(`\t ${table.handlerName}`);
        this.form  = form;
        this.table = table;

		this.initAuxBtn();
		this.initMainBtn();
		this.initTable(data);
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
            let index = this.table.indexFrom(event);
			
			let values = [index, ...this.table.tdValues(index)];   // values = index + td values
            this.form.fillWith(values);

			this.toEditMode();
			console.log(`[${this.handlerName}] row ${index} selected!`);
		}
	}

    update() {
		if (this.isValidForm()) {
            let index = this.form.fields[Handler.INDEX].value;
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



class CompositeHandler extends Handler
{
	taskHandler;
	toolHandler;
	
	constructor(form, extTable, data, taskData, toolData) {
		super(form, extTable, data);
		this.taskHandler = new IweTaskHandler(taskData);
		this.toolHandler = new IweToolHandler(toolData);
	}

	initAuxBtn() {
    	this.form.$btnAux.on('click', event => {
        	event.preventDefault();
			if (!super.insertMode) {
				super.toInsertMode();
				this.taskHandler.table.deleteRows();
				this.toolHandler.table.deleteRows();
			}
			else {
				if (this.taskHandler.table.hasRows() || this.toolHandler.table.hasRows()) {
					if (confirm(`\xBFEliminar tambi\xE9n contenido de tablas\x3F`)) {
						this.taskHandler.table.deleteRows();
						this.toolHandler.table.deleteRows();
					}
				}
				this.form.reset();
				this.taskHandler.form.reset();
				this.toolHandler.form.reset();
			}
			event.target.blur();
    	});
    }

	insert() {
		if (this.isValidForm()) {
			let values = this.form.values();
			values.push( this.taskHandler.table.data() );
			values.push( this.toolHandler.table.data() );
            this.table.insert(values);

			this.form.reset();
			this.taskHandler.form.reset();
			this.toolHandler.form.reset();

			this.taskHandler.table.deleteRows();
			this.toolHandler.table.deleteRows();

            let index = this.table.size() - 1;
			console.log("### " + JSON.stringify(this.table.data(), null, 2));
			console.log(`[${this.handlerName}] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.insertMode) {
			event.preventDefault();

			this.taskHandler.exitEditMode();
			this.taskHandler.table.deleteRows();
			this.toolHandler.exitEditMode();
			this.toolHandler.table.deleteRows();
			this.toEditMode();

            let index = this.table.indexFrom(event);
			let values = [index];   // values = index + td values
			values.push( ...this.table.tdValues(index) );
			let fieldsNumber = this.table.simpleCols + 1;   // fieldsNumber = index + fields

            this.form.fillWith( values.slice(0, fieldsNumber) );
			this.taskHandler.table.load( values[fieldsNumber] );   // fill tables
			this.toolHandler.table.load( values[fieldsNumber + 1] );

			console.log(`[${this.handlerName}] row ${index} selected!`);
		}
	}

	update() {
		if (this.isValidForm()) {
            let index = this.form.fields[Handler.INDEX].value;

			let values = this.form.values();
			values.push( this.taskHandler.table.data() );
			values.push( this.toolHandler.table.data() );
            this.table.update(values, index);

			this.form.reset();
			this.taskHandler.form.reset();
			this.toolHandler.form.reset();

			this.taskHandler.table.deleteRows();
			this.toolHandler.table.deleteRows();

			this.toInsertMode();
			console.log("### " + JSON.stringify(this.table.data(), null, 2));
			console.log(`[${this.handlerName}] row ${index} updated!`);
		}
	}

	exitEditMode() {
		if (this.insertMode == false) {
			this.form.cancelEdition();
			this.taskHandler.form.cancelEdition();
			this.toolHandler.form.cancelEdition();
		}
	}

}//
