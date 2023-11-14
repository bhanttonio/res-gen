
class Form
{
    static AUX_CLEAN   = 'Limpiar';    // aux button labels
    static AUX_CANCEL  = 'Cancelar';
    static MAIN_INSERT = 'Agregar';    // main button labels
    static MAIN_UPDATE = 'Editar';

    elForm;
    fields = [];   // index field + other text fields
    formLegend;
    insertLegend = 'Nuevo';

    $legend;
	$btnAux;
	$btnMain;

    constructor(config) {
        this.elForm = config.elForm;
        this.formLegend = config.formLegend;
        if (config.insertLegend) this.insertLegend = config.insertLegend;
        this.initRefs();

        if (config.$btnAux) this.$btnAux = config.$btnAux;
        if (config.$btnMain) this.$btnMain = config.$btnMain;
    }

    // CONFIG

    initRefs() {
        [...this.elForm.elements].forEach(element => {
            if (element.type == 'hidden')
                this.fields.push(element);   // first add index field
            else if (element.type == 'text')
                this.fields.push(element);
            else if (element.name.startsWith('btnAux'))
                this.$btnAux = $(element);
            else if (element.name.startsWith('btnMain')) 
                this.$btnMain = $(element);
        });
        this.$legend = $(this.elForm).find('legend');
    }
    
    initCharCounters() {
        [...this.elForm.elements]
            .filter(element => element.type == 'text')
            .forEach(element => $(element).characterCounter());
    }

    toInsertMode() {
		this.$legend.html(this.formLegend + ` [${this.insertLegend}]`);
		this.$btnAux.html(Form.AUX_CLEAN);
		this.$btnMain.html(Form.MAIN_INSERT);
	}

    reset() {
		this.elForm.reset();
		this.initCharCounters();
	}

    // SELECT ROW

    toUpdateMode(editLegend = 'Edici&oacute;n') {
		this.$legend.html(this.formLegend + ` [${editLegend}]`);
		this.$btnAux.html(Form.AUX_CANCEL);
		this.$btnMain.html(Form.MAIN_UPDATE);
	}

    fillWith(values) {
        this.fields.forEach( field => {   // set values of fields (including the index field)
            field.value = values.shift();
            field.focus();
        });
    }

    // HELPER

    values() {
        let values = [];
        this.fields.slice(1).forEach( field => values.push(field.value) );   // ignores index field
        return values;
    }

    cancelUpdate() {
        this.$btnAux.trigger('click');
    }

}//
