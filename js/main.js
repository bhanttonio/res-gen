
var educationHandler;
var courseHandler;
var languageHandler;
var skillHandler;
var sectorHandler;


$(function() {
    console.log('loading');
    M.AutoInit();

    educationHandler = new EducationHandler();
    courseHandler = new CourseHandler();
    languageHandler = new LanguageHandler();
    skillHandler = new SkillHandler();
    sectorHandler = new SectorHandler();
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
        this.#setUpCharCounters();
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

    #setUpCharCounters() {
        console.log('\t\t character counters');
        $('input#name, input#surname_1, input#surname_2, input#level, textarea#profile').characterCounter();
        $('input#iwe_account_1, input#iwe_rol_1, input#iwe_project_1, input#iwe_period_1, input#iwe_task_1, input#iwe_tool_1').characterCounter();
        $('input#ewe_company_1, input#ewe_rol_1, input#ewe_period_1, input#ewe_task_1, input#ewe_tool_1').characterCounter();
    }

    #setUpDirButtons() {
        console.log('\t\t prev buttons');
        this.#setUpButtons(this.#$btnsPrev);

        console.log('\t\t next buttons');
        this.#setUpButtons(this.#$btnsNext);
    }

    #setUpButtons($btns) {
        $btns.on('click', e => {
            e.preventDefault();
            let tab = e.target.getAttribute('data-tab');
            this.#tabsInstance.select(tab);
        });
    }

    #setUpTabs() {
        console.log('\t\t tabs');

		$(this.#elTabs).on('click', 'a', function(e) {   // on click leave tab's state consistent
			let href = e.target.getAttribute('href');
			console.log(`\u2192 ${href}`);

			if (href !== '#education') {   // education module
				educationHandler.exitDisabledMode();
			}

            if (href != '#courses') {   // courses module
                courseHandler.exitDisabledMode();
            }

            if (href != '#languages') {   // languages module
                languageHandler.exitDisabledMode();
            }
            
            if (href != '#skills') {   // skills module
                skillHandler.exitDisabledMode();
            }

            if (href != '#sectors') {   // sectors module
                sectorHandler.exitDisabledMode();
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
            console.warn('Unable to read \'tab\' param from the URL ');
        }
    }

}//

