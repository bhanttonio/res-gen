

class LanguageHandler extends ModuleHandler
{
    static #NAME  = 0;
	static #SPEAK = 1;
	static #READ  = 2;
    static #WRITE = 3;
    static #INDEX = 4;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formLang');
        this.elIndex = this.elForm.elements.indexLang;

        let elName   = this.elForm.elements.nameLang;
        let elSpeak  = this.elForm.elements.speakLang;
        let elRead   = this.elForm.elements.readLang;
        let elWrite  = this.elForm.elements.writeLang;
        this.fields = [elName, elSpeak, elRead, elWrite];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxLang');
        this.$btnMain   = $('#btnMainLang');
        this.$tableBody = $('table#tableLang tbody');

        // aux fields
        this.formLegend  = 'Idioma';
        this.rowType     = RowType.REDUCED;
        this.handlerName = 'languageHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[LanguageHandler.#NAME] ) * 
             Validator.isPercentageValid( this.fields[LanguageHandler.#SPEAK] ) * 
             Validator.isPercentageValid( this.fields[LanguageHandler.#READ] ) * 
             Validator.isPercentageValid( this.fields[LanguageHandler.#WRITE] );
    }

    getObject(data) {
        return new Language(
            data[LanguageHandler.#NAME],
            data[LanguageHandler.#SPEAK],
            data[LanguageHandler.#READ],
            data[LanguageHandler.#WRITE], 
            data[LanguageHandler.#INDEX] 
        );
    }

}//



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
        this.elIndex = this.elForm.elements.indexSkill;
        
        let elDesc  = this.elForm.elements.descSkill;
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
        this.elIndex = this.elForm.elements.indexSector;
        
        let elDesc  = this.elForm.elements.descSector;
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

