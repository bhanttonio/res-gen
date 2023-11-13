
class Form
{
    static AUX_CLEAN   = 'Limpiar';    // aux button labels
    static AUX_CANCEL  = 'Cancelar';
    static MAIN_INSERT = 'Agregar';    // main button labels
    static MAIN_UPDATE = 'Editar';

    elForm;
    fields = [];
    legendLabel;
    insertLegend = 'Nuevo';

    $legend;
	$btnAux;
	$btnMain;

    constructor(config) {
        this.elForm = config.elForm;
        if (config.insertLegend)
            this.insertLegend = config.insertLegend;
        this.initRefs();
    }

    // CONFIG

    initRefs() {
        [...this.elForm.elements].forEach(element => {
            console.log(element);
            if (element.type == 'hidden')
                this.fields.push(element);
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
		this.$legend.html(this.legendLabel + ` [${this.insertLegend}]`);
		this.$btnAux.html(Form.AUX_CLEAN);
		this.$btnMain.html(Form.MAIN_INSERT);
	}

    reset() {
		this.elForm.reset();
		this.initCharCounters();
	}

    // SELECT ROW

    toUpdateMode(editLegend = 'Edici&oacute;n') {
		this.$legend.html(this.legendLabel + ` [${editLegend}]`);
		this.$btnAux.html(Form.AUX_CANCEL);
		this.$btnMain.html(Form.MAIN_UPDATE);
	}

    fillWith(tdValues) {
        this.fields.forEach( field => {
            field.value = tdValues.shift();
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
