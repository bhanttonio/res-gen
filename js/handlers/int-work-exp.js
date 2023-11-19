

class IweTaskHandler extends Handler
{
    static #HANDLER_NAME = 'iweHandler.form.taskHandler';
    static DESC = 1; 

    constructor(data) {
        super({ 
            form: 
                new Form({
                    elForm:  document.getElementById('formIweTask'), 
                    formLegend: 'Actividad',
                    insertLegend: 'Nueva', 
                    $btnAux: $('#linkAuxIweTask'),
                    $btnMain: $('#linkMainIweTask'), 
                    $legend: $('#labelIweTask')
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableIweTask tbody'),
                    handlerName: IweTaskHandler.#HANDLER_NAME, 
                    object: new String()
                }), 
            data: data, 
            handlerName: IweTaskHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweTaskHandler.DESC] );
    }

}//


class IweToolHandler extends Handler
{
    static #HANDLER_NAME = 'iweHandler.form.toolHandler';
    static DESC = 1; 

    constructor(data) {
        super({ 
            form: 
                new Form({
                    elForm:  document.getElementById('formIweTool'), 
                    formLegend: 'Entorno', 
                    $btnAux: $('#linkAuxIweTool'),
                    $btnMain: $('#linkMainIweTool'),
                    $legend: $('#labelIweTool')
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableIweTool tbody'),
                    handlerName: IweToolHandler.#HANDLER_NAME, 
                    object: new String()
                }), 
            data: data, 
            handlerName: IweToolHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweToolHandler.DESC] );
    }

}//


class IweHandler extends Handler
{
    static #HANDLER_NAME = 'iweHandler';
    static ACCOUNT = 1;
    static ROLE = 2;
    static PROJECT = 3;
    static PERIOD  = 4;

    constructor(data, taskData, toolData) { 
        super({ 
            form: 
                new ExtendedForm({ 
                        elForm: document.getElementById('formIwe'), 
                        formLegend: 'Experiencia Interna', 
                        insertLegend: 'Nueva', 
                        $btnAux: $('#btnAuxIwe'), 
                        $btnMain: $('#btnMainIwe'), 
                        simpleFields: 5   // including index
                    }, 
                    new IweTaskHandler(taskData), 
                    new IweToolHandler(toolData) ), 
            table: 
                new ExtendedTable({
                    $tableBody: $('table#tableIwe tbody'),
                    handlerName: IweHandler.#HANDLER_NAME, 
                    object: new IntWorkExp(), 
                    simpleCols: 4
                }),
            data: data, 
            handlerName: IweHandler.#HANDLER_NAME
        }); 
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweHandler.ACCOUNT] ) * 
               Validator.isInputNotEmpty( this.form.fields[IweHandler.ROLE] ) * 
               Validator.isInputNotEmpty( this.form.fields[IweHandler.PROJECT] ) * 
               Validator.isInputNotEmpty( this.form.fields[IweHandler.PERIOD] );
    }

}//

