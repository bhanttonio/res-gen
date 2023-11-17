
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

    cancelEdition() {
        this.$btnAux.trigger('click');
    }

}//
