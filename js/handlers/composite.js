

class IweTaskHandler extends Handler
{
    static DESC = 1; 

    constructor(data) {
        super( 
            new Form({
                elForm:  document.getElementById('formIweTask'), 
                formLegend: 'Actividad',
                insertLegend: 'Nueva', 
                $btnAux: $('#linkAuxIweTask'),
                $btnMain: $('#linkMainIweTask')
            }), 
            new Table({
                $tableBody: $('table#tableIweTask tbody'),
                handler: 'iweHandler.taskHandler', 
                object: new String()
            }
        ), 
        data);
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweTaskHandler.DESC] );
    }

}//


class IweToolHandler extends Handler
{
    static DESC = 1; 

    constructor(data) {
        super( 
            new Form({
                elForm:  document.getElementById('formIweTool'), 
                formLegend: 'Entorno', 
                $btnAux: $('#linkAuxIweTool'),
                $btnMain: $('#linkMainIweTool')
            }), 
            new Table({
                $tableBody: $('table#tableIweTool tbody'),
                handler: 'iweHandler.toolHandler', 
                object: new String()
            }
        ), 
        data);
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweToolHandler.DESC] );
    }

}//


class IweHandler extends CompositeHandler
{
    static ACCOUNT = 1;
    static ROLE = 2;
    static PROJECT = 3;
    static PERIOD  = 4;

    constructor(data, taskData, toolData) { 
        super( 
            new Form({ 
                elForm: document.getElementById('formIwe'), 
                formLegend: 'Experiencia Interna', 
                insertLegend: 'Nueva', 
                $btnAux: $('#btnAuxIwe'), 
                $btnMain: $('#btnMainIwe')
            }), 
            new ExtendedTable({
                $tableBody: $('table#tableIwe tbody'),
                handler: 'iweHandler', 
                object: new IntWorkExp(), 
                simpleColsSize: 4
            }),
            data, taskData, toolData
        ); 
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweHandler.ACCOUNT] ) * 
               Validator.isInputNotEmpty( this.form.fields[IweHandler.ROLE] ) * 
               Validator.isInputNotEmpty( this.form.fields[IweHandler.PROJECT] ) * 
               Validator.isInputNotEmpty( this.form.fields[IweHandler.PERIOD] );
    }

}//

