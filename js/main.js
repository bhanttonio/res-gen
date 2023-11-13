
var basicHandler;
var eduHandler;
var courseHandler;
var languageHandler;
var skillHandler;
var sectorHandler;
var iweHandler;


$(function() {
    console.log('loading');
    M.AutoInit();

    basicHandler = new BasicHandler();

    eduHandler = new EduHandler([
        {name: 'Licenciatura en Informática Administrativa', institute: 'Universidad Nacional Autónoma de México', start: 2015, end: 2020}, 
        {name: 'Maestría en Administración', institute: 'Universidad del Valle de México', start: 2020, end: 2023}
    ]);
    
    courseHandler = new CourseHandler();
    languageHandler = new LanguageHandler();
    skillHandler = new SkillHandler();
    sectorHandler = new SectorHandler();
    iweHandler = new IweHandler();

    new MainHandler();
    console.log('finished');
});


class MainHandler 
{
    #elTabs;
    #tabsInstance;
    #$btnsNext;
    #$btnsPrev;

    constructor() {
        console.log('\t main handler');
        this.#loadRefs();
        this.#setUpDirButtons();
        this.#setUpTabs();
        this.#setUpTabOnLoad();
    }

    #loadRefs() {
        console.log('\t\t references');
        this.#elTabs = document.getElementById('tabs');
        this.#tabsInstance = M.Tabs.getInstance(this.#elTabs);
        this.#$btnsPrev = $('button[id^="btnPrev"]');
        this.#$btnsNext = $('button[id^="btnNext"]');
    }

    #setUpDirButtons() {
        console.log('\t\t prev buttons');
        this.#setUpButtons(this.#$btnsPrev);

        console.log('\t\t next buttons');
        this.#setUpButtons(this.#$btnsNext);
    }

    #setUpButtons($btns) {
        $btns.on('click', event => {
            event.preventDefault();
            let tab = event.target.getAttribute('data-tab');
            this.#tabsInstance.select(tab);
        });
    }

    #setUpTabs() {
        console.log('\t\t tabs');

		$(this.#elTabs).on('click', 'a', function(event) {   // on click leave tab's state consistent
			let href = event.target.getAttribute('href');
			console.log(`\u2192 ${href}`);

            if (href !== '#basic') {
                basicHandler.isValidForm();
                // console.log( JSON.stringify(basicHandler.getObject(), null, 2) );
            }

			if (href !== '#education') {
                eduHandler.exitEditMode();
                // console.log( JSON.stringify(educationHandler.getObjectList(), null, 2) );
            }
			
            if (href != '#courses') {
                courseHandler.exitEditMode();
                // console.log( JSON.stringify(courseHandler.getObjectList(), null, 2) );
            }
            
            if (href != '#languages') {
                languageHandler.exitEditMode();
                // console.log( JSON.stringify(languageHandler.getObjectList(), null, 2) );
            }
            if (href != '#skills') {
                skillHandler.exitEditMode();
                // console.log( JSON.stringify(skillHandler.getObjectList(), null, 2) );
            }
            if (href != '#sectors') {
                sectorHandler.exitEditMode();
                // console.log( JSON.stringify(sectorHandler.getObjectList(), null, 2) );
            }

            if (href != '#int-work-exp') {
                iweHandler.exitEditMode();
                iweHandler.taskHandler.exitEditMode();
                iweHandler.toolHandler.exitEditMode();
                // console.log( JSON.stringify(iweHandler.getObjectList(), null, 2) );
            }
		});
    }

    #setUpTabOnLoad() {
        try {
            let labels = ['basic', 'education', 'courses', 'languages', 'skills', 'sectors', 'int-work-exp', 'ext-work-exp'];

            let arr = window.location.href.split('?');
            let queryStr = arr.length > 1 ? arr[1] : null;
            let params = queryStr ? queryStr.split('&') : null;
            let tabParam = params ? params[0].split('=') : null;
            let tab = tabParam ? tabParam[1].trim().toLowerCase() : null;

            if (labels.includes(tab)) {
                this.#tabsInstance.select(tab);
            }
        } 
        catch(err) {
            console.warn('Unable to read \'tab\' param from the URL');
        }
    }

}//

