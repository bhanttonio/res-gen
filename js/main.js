
let educationHandler


$(function() {
    console.log('loading')
    M.AutoInit()

    new MainHandler()
    educationHandler = new EducationHandler()

    let arr = window.location.href.split('?')
    let keyValue = arr.length > 1 ? arr[1] : null
    arr = keyValue ? keyValue.split('=') : new Array()
    let tab = arr.length > 1 ? arr[1].trim().toLowerCase() : null
    let tabsInstance = M.Tabs.getInstance(document.getElementById('tabs'))
    if (['basic', 'education', 'courses', 'languages', 'skills', 'sectors', 'int-work-exp', 'ext-work-exp'].includes(tab)) {
        tabsInstance.select(tab)
    }

    console.log('finished')
});


class MainHandler 
{
    #$tabs
    #$btnsNext

    constructor() {
        console.log('\t main handler')
        this.#loadRefs()
        this.#setUpCharCounters()
        this.#setUpNextButtons()
        this.#setUpTabs()
    }

    #loadRefs() {
        console.log('\t\t references')
        this.#$tabs = $('ul#tabs')
        this.#$btnsNext = $('button[id^="btnNext"]')
    }

    #setUpCharCounters() {
        console.log('\t\t character counters')
        
        $('input#name, input#surname_1, input#surname_2, input#level, textarea#profile').characterCounter()
        $('input#course_name_1, input#course_institute_1, input#course_date_1').characterCounter()
        $('input#lang_name_1, input#lang_speaking_1, input#lang_reading_1, input#lang_writing_1').characterCounter()
        $('input#skill_1').characterCounter()
        $('input#sector_1').characterCounter()
        $('input#iwe_account_1, input#iwe_rol_1, input#iwe_project_1, input#iwe_period_1, input#iwe_task_1, input#iwe_tool_1').characterCounter()
        $('input#ewe_company_1, input#ewe_rol_1, input#ewe_period_1, input#ewe_task_1, input#ewe_tool_1').characterCounter()

    }

    #setUpNextButtons() {
        console.log('\t\t next buttons')
        let tabsInstance = M.Tabs.getInstance(this.#$tabs)

        this.#$btnsNext.on('click', function(e) {   // on click change tab
            e.preventDefault()

            let tab = e.target.getAttribute('data-tab')
            tabsInstance.select(tab)
        })
    }

    #setUpTabs() {
        console.log('\t\t tabs')

		this.#$tabs.on('click', 'a', function(e) {   // on click leave tab's state consistent
			let href = e.target.getAttribute('href')
			console.log(`>> section: ${href}`)

            // edu module
			if (href !== '#education') {
				educationHandler.exitDisabledMode()
			}

		})
    }

}//

