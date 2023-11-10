
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
        this.elIndex = this.elForm.elements.indexIweTask;

        let elDesc  = this.elForm.elements.descIweTask;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $('#labelIweTask');
        this.$btnAux    = $('#linkAuxIweTask');
        this.$btnMain   = $('#linkMainIweTask');
        this.$tableBody = $('table#tableIweTask tbody');

        // aux values
        this.FORM_LEGEND  = 'Actividad';
        this.INSERT_LEGEND = ' &lsqb;Nueva&rsqb;';
        this.HANDLER_NAME = 'iweHandler.taskHandler';
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
        this.elIndex = this.elForm.elements.indexIweTool;

        let elDesc  = this.elForm.elements.descIweTool;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $('#labelIweTool');
        this.$btnAux    = $('#linkAuxIweTool');
        this.$btnMain   = $('#linkMainIweTool');
        this.$tableBody = $('table#tableIweTool tbody');

        // aux values
        this.FORM_LEGEND  = 'Entorno';
        this.INSERT_LEGEND = ' &lsqb;Nuevo&rsqb;';
        this.HANDLER_NAME = 'iweHandler.toolHandler';
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



class IweHandler extends MultipleModuleHandler
{
    static #ACCOUNT = 0;
    static #ROLE = 1;
    static #PROJECT = 2;
    static #PERIOD  = 3;
    static #TASKS = 4;
    static #TOOLS = 5;
    static #INDEX = 6;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formIwe');
        this.elIndex = this.elForm.elements.indexIwe;

        let elAccount = this.elForm.elements.accountIwe;
        let elRole     = this.elForm.elements.roleIwe;
        let elProject = this.elForm.elements.projectIwe;
        let elPeriod  = this.elForm.elements.periodIwe;
        this.fields = [elAccount, elRole, elProject, elPeriod];
        
        // jquery objects
        this.$legend = $('#formLegendIwe');
        this.$btnAux = $('#btnAuxIwe');
        this.$btnMain = $('#btnMainIwe');
        this.$tableBody = $('table#tableIwe tbody');

        // aux values
        this.FORM_LEGEND = 'Experiencia Interna';
        this.INSERT_LEGEND = ' &lsqb;Nueva&rsqb;';
        this.HANDLER_NAME = 'iweHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[IweHandler.#ACCOUNT] ) * 
               Validator.isInputNotEmpty( this.fields[IweHandler.#ROLE] ) * 
               Validator.isInputNotEmpty( this.fields[IweHandler.#PROJECT] ) * 
               Validator.isInputNotEmpty( this.fields[IweHandler.#PERIOD] );
    }

    getObject(data) {
        return new InternalWorkExperience(
            data[IweHandler.#ACCOUNT], 
            data[IweHandler.#ROLE], 
            data[IweHandler.#PROJECT], 
            data[IweHandler.#PERIOD], 
            data[IweHandler.#TASKS], 
            data[IweHandler.#TOOLS], 
            data[IweHandler.#INDEX]
        );
    }

}// 

