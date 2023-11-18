
class Form
{
    static #AUX_CLEAN   = 'Limpiar';    // aux button labels
    static #AUX_CANCEL  = 'Cancelar';
    static #MAIN_INSERT = 'Agregar';    // main button labels
    static #MAIN_EDIT   = 'Editar';

    elForm;
    formLegend;
    insertLegend = 'Nuevo';
    editLegend = 'Edici&oacute;n';
    fields = [];                       // index field + other text fields

    $legend;
	$btnAux;
	$btnMain;

    constructor(config) {
        this.initRefs(config);
        this.initCharCounters();
    }

    initRefs(config) {
        this.elForm = config.elForm;
        this.formLegend = config.formLegend;
        if (config.insertLegend) this.insertLegend = config.insertLegend;
        if (config.editLegend)   this.editLegend = config.editLegend;
        
        [...this.elForm.elements].forEach(element => {
            if (element.type == 'hidden')     this.fields.push(element);   // add index field first
            else if (element.type == 'text')  this.fields.push(element);
            else if (element.name.startsWith('btnAux'))   this.$btnAux = $(element);
            else if (element.name.startsWith('btnMain'))  this.$btnMain = $(element);
        });

        this.$legend = $(this.elForm).find('legend');
        if (!this.$btnAux)  this.$btnAux = config.$btnAux;        
        if (!this.$btnMain) this.$btnMain = config.$btnMain;
    }
    
    initCharCounters() {
        this.fields.slice(1).forEach(field => $(field).characterCounter());   // ignores index field
    }

    toInsertMode() {
		this.$legend.html(`${this.formLegend} [${this.insertLegend}]`);
		this.$btnAux.html(Form.#AUX_CLEAN);
		this.$btnMain.html(Form.#MAIN_INSERT);
        this.reset();
	}

    toEditMode() {
		this.$legend.html(`${this.formLegend} [${this.editLegend}]`);
		this.$btnAux.html(Form.#AUX_CANCEL);
		this.$btnMain.html(Form.#MAIN_EDIT);
	}

    reset() {
		this.elForm.reset();
		this.initCharCounters();
	}

    fillWith(values) {
        this.fields.forEach(field => {      // set fields (including index field)
            field.value = values.shift();
            field.focus();
        });
    }

    values() {   
        return this.fields.slice(1).map(field => field.value);   // ignores index field
    }

}//



class ExtendedForm extends Form
{
    #taskHandler; 
    #toolHandler; 

    constructor(config, taskData, toolData) {
        super(config);
        this.#taskHandler = new IweTaskHandler(taskData);
        this.#toolHandler = new IweToolHandler(toolData);
    }

    toInsertMode() {
        super.toInsertMode();
        this.handlersToInsertMode();
    }

    toEditMode() {
        super.toEditMode();
        this.handlersToInsertMode();
    }

    handlersToInsertMode() {
        this.#taskHandler.form.toInsertMode();
        this.#toolHandler.form.toInsertMode();
        this.clearTables();
    }

    clearTables() {
        this.#taskHandler.table.deleteRows();
        this.#toolHandler.table.deleteRows();
    }

    reset() {
        super.reset();
        this.#taskHandler.form.reset();
        this.#toolHandler.form.reset();
    }

    fillWith(values, taskValues, toolValues) {
        super.fullWith(values);                     // set simple fields (including index field)
        this.#taskHandler.table.load(taskValues);   // set related tasks
        this.#toolHandler.table.load(toolValues);   // set related tools
    }

    values() {
        let simpleValues = super.values();
        let taskValues = this.#taskHandler.table.data();
        let toolValues = this.#toolHandler.table.data();
        return [simpleValues, taskValues, toolValues];
    }

}// 
