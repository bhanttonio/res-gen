
class IweTaskHandler extends ModuleHandler
{
    static #DESC  = 0;
    static #INDEX = 1;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formIweTask');
        let elDesc  = this.elForm.elements.descIweTask;
        this.elIndex = this.elForm.elements.indexIweTask;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $('#labelIweTask');
        this.$btnAux    = $('#linkAuxIweTask');
        this.$btnMain   = $('#linkMainIweTask');
        this.$tableBody = $('table#tableIweTask tbody');

        // aux fields
        this.formLegend  = 'Actividad';
        this.INSERT_LEGEND = ' &lsqb;Nueva&rsqb;';
        this.rowType     = RowType.REDUCED;
        this.handlerName = 'iweTaskHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[IweTaskHandler.#DESC] );
    }

    getObject(data) {
        return new Task(
            data[IweTaskHandler.#DESC], 
            data[IweTaskHandler.#INDEX] 
        );
    }

}// 



class IweToolHandler extends ModuleHandler
{
    static #DESC  = 0;
    static #INDEX = 1;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formIweTool');
        let elDesc  = this.elForm.elements.descIweTool;
        this.elIndex = this.elForm.elements.indexIweTool;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $('#labelIweTool');
        this.$btnAux    = $('#linkAuxIweTool');
        this.$btnMain   = $('#linkMainIweTool');
        this.$tableBody = $('table#tableIweTool tbody');

        // aux fields
        this.formLegend  = 'Entorno';
        this.INSERT_LEGEND = ' &lsqb;Nuevo&rsqb;';
        this.rowType     = RowType.REDUCED;
        this.handlerName = 'iweToolHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[IweToolHandler.#DESC] );
    }

    getObject(data) {
        return new Tool(
            data[IweToolHandler.#DESC], 
            data[IweToolHandler.#INDEX] 
        );
    }

}// 

