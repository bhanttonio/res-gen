
class SkillHandler extends ModuleHandler
{
    static #DESC  = 0;
    static #INDEX = 1;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formSkill');
        let elDesc  = this.elForm.elements.descSkill;
        this.elIndex = this.elForm.elements.indexSkill;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxSkill');
        this.$btnMain   = $('#btnMainSkill');
        this.$tableBody = $('table#tableSkill tbody');

        // aux fields
        this.formLegend  = 'Conocimiento';
        this.rowType     = RowType.REDUCED;
        this.handlerName = 'skillHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[SkillHandler.#DESC] );
    }

    getObject(data) {
        return new Skill(
            data[SkillHandler.#DESC], 
            data[SkillHandler.#INDEX] 
        );
    }

}// 



class SectorHandler extends ModuleHandler
{
    static #DESC  = 0;
    static #INDEX = 1;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formSector');
        let elDesc  = this.elForm.elements.descSector;
        this.elIndex = this.elForm.elements.indexSector;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxSector');
        this.$btnMain   = $('#btnMainSector');
        this.$tableBody = $('table#tableSector tbody');

        // aux fields
        this.formLegend  = 'Sector';
        this.rowType     = RowType.REDUCED;
        this.handlerName = 'sectorHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[SectorHandler.#DESC] );
    }

    getObject(data) {
        return new Sector(
            data[SectorHandler.#DESC], 
            data[SectorHandler.#INDEX] 
        );
    }

}// 

