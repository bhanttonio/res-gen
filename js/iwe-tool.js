
class IweToolHandler extends ModuleHandler
{

    static #COL_DESC = 0;


    constructor() {
        super();
    }


    initRefs() 
    {
        // dom elements
        this.elForm  = document.getElementById('formIweTool');
        this.elIndex = this.elForm.elements.iweToolIndex;

        // individual fields
        let elDesc  = this.elForm.elements.iweToolDesc;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend  = $('#iweToolLabel');
        this.$btnAux  = $('#linkAuxIweTool');
        this.$btnMain = $('#linkMainIweTool');
        this.$tableBody = $('table#tableIweTool tbody');

        // aux fields
        this.formLegend  = 'Descripci&oacute;n';
        this.refColumn   = IweToolHandler.#COL_DESC;
        this.handlerName = 'iweToolHandler';
        this.reducedRows = true;
    }


    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[IweToolHandler.#COL_DESC] );
    }


    getTools() {
        let tools = new Array();
        this.$tableBody.children().each( function(index) {
            let desc = $(this).children().eq(IweToolHandler.#COL_DESC).text();
            tools.push( new Tool(desc, index) );
        });
        return tools;
    }

}
