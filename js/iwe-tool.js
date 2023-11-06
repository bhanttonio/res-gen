
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
        this.elIndex = this.elForm.elements.iweToolIndex;

        // individual fields
        let elDesc  = this.elForm.elements.iweToolDesc;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $('#iweToolLabel');
        this.$btnAux    = $('#linkAuxIweTool');
        this.$btnMain   = $('#linkMainIweTool');
        this.$tableBody = $('table#tableIweTool tbody');

        // aux fields
        this.formLegend  = 'Descripci&oacute;n';        
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

}
