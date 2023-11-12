
class FormComponent
{

    static AUX_CLEAN   = 'Limpiar';    // aux button labels
    static AUX_CANCEL  = 'Cancelar';
    static MAIN_INSERT = 'Agregar';    // main button labels
    static MAIN_UPDATE = 'Editar';

    
    elForm;
    elIndex;
    fieldArray;
    formLegend;
    insertLegend = '&nbsp;&lsqb;Nuevo&rsqb;';
    editLegend = '&nbsp;&lsqb;Edici&oacute;n&rsqb;';

    $legend;
	$btnAux;
	$btnMain;


    constructor(config) {
        this.elForm = config.elForm;
        this.elIndex = config.elIndex;
        this.fieldArray = config.fieldArray;
        this.formLegend = config.formLegend;
        
        if (config.insertLegend)
            this.insertLegend = config.insertLegend;
        if (config.editLegend)
            this.editLegend = config.editLegend;

        this.$legend = config.$legend;
        this.$btnAux = config.$btnAux;
        this.$btnMain = config.$btnMain;
    }


    // CONFIG
    
    initCharCounters() {
        [...this.elForm.elements]
            .filter(element => element.type.startsWith('text'))
            .forEach(element => $(element).characterCounter());
    }

    toInsertMode() {
		this.$legend.html(this.formLegend + this.insertLegend);
		this.$btnAux.html(FormComponent.AUX_CLEAN);
		this.$btnMain.html(FormComponent.MAIN_INSERT);
	}

    reset() {
		this.elForm.reset();
		this.initCharCounters();
	}


    // SELECT ROW

    toUpdateMode() {
		this.$legend.html(this.formLegend + this.editLegend);
		this.$btnAux.html(FormComponent.AUX_CANCEL);
		this.$btnMain.html(FormComponent.MAIN_UPDATE);
	}

    fillWith($tds, index) {
        for (let i = 0; i < $tds.length; i++) {
            this.fieldArray[i].value = $tds.eq(i).text();
            this.fieldArray[i].focus();
        }
        this.elIndex.value = index;
    }


    // HELPER

    cancelUpdate() {
        this.$btnAux.trigger('click');
    }

}//
