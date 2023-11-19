

class EweTaskHandler extends Handler
{
    static #HANDLER_NAME = 'eweHandler.form.taskHandler';
    static #DESC = 1; 

    constructor(data) {
        super({ 
            form: 
                new Form({
                    elForm:  document.getElementById('formEweTask'), 
                    formLegend: 'Actividad',
                    insertLegend: 'Nueva', 
                    $btnAux: $('#linkAuxEweTask'),
                    $btnMain: $('#linkMainEweTask'), 
                    $legend: $('#labelEweTask')
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableEweTask tbody'),
                    handlerName: EweTaskHandler.#HANDLER_NAME, 
                    object: new String()
                }), 
            data: data, 
            handlerName: EweTaskHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[EweTaskHandler.#DESC] );
    }

}//


class EweToolHandler extends Handler
{
    static #HANDLER_NAME = 'eweHandler.form.toolHandler';
    static #DESC = 1; 

    constructor(data) {
        super({ 
            form: 
                new Form({
                    elForm:  document.getElementById('formEweTool'), 
                    formLegend: 'Entorno', 
                    $btnAux: $('#linkAuxEweTool'),
                    $btnMain: $('#linkMainEweTool'),
                    $legend: $('#labelEweTool')
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableEweTool tbody'),
                    handlerName: EweToolHandler.#HANDLER_NAME, 
                    object: new String()
                }), 
            data: data, 
            handlerName: EweToolHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[EweToolHandler.#DESC] );
    }

}//


class EweHandler extends Handler
{
    static #HANDLER_NAME = 'eweHandler';
    static #COMPANY = 1;
    static #ROLE = 2;
    static #PERIOD  = 3;

    constructor(data, taskData, toolData) { 
        super({ 
            form: 
                new ExtendedForm({ 
                        elForm: document.getElementById('formEwe'), 
                        formLegend: 'Experiencia Externa', 
                        insertLegend: 'Nueva', 
                        $btnAux: $('#btnAuxEwe'), 
                        $btnMain: $('#btnMainEwe'), 
                        simpleFields: 4               // including index
                    }, 
                    new EweTaskHandler(taskData), 
                    new EweToolHandler(toolData) ), 
            table: 
                new ExtendedTable({
                    $tableBody: $('table#tableEwe tbody'),
                    handlerName: EweHandler.#HANDLER_NAME, 
                    object: new EweWorkExp(), 
                    simpleCols: 3
                }),
            data: data, 
            handlerName: EweHandler.#HANDLER_NAME
        }); 
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[EweHandler.#COMPANY] ) * 
               Validator.isInputNotEmpty( this.form.fields[EweHandler.#ROLE] ) * 
               Validator.isInputNotEmpty( this.form.fields[EweHandler.#PERIOD] );
    }

}//

