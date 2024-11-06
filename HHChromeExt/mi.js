'use strict'

;(() => {

    const uvicornPort = localStorage.getItem('HH20241106-uvicorn-port')

    const get_el_selector = () => {
        return '[data-sentry-element="Element"]'
    }

    const get_links_selector = (vacancyId = '') => {
        if (vacancyId !== '') {
            vacancyId += '&'
        }
        return get_el_selector() + ' a[role="button"]' +
            '[href^="/applicant/vacancy_response?vacancyId=' + vacancyId + '"]'
    }

    const getCurrentDatetime = () => {
          const now = new Date();

          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');

          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');

          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const alertFns = (msg) => {
        const id = 'HH20241106-log'
        let logEl = document.querySelector('#' + id)
        if (!logEl) {
            document.body.insertAdjacentHTML(
                'beforeend',
                '<div id="' + id + '"></div>'
            )
            logEl = document.querySelector('#' + id)
            logEl.addEventListener('click', (e) => {
                e.currentTarget.remove()
            })
        }
        logEl.insertAdjacentHTML(
            'afterbegin',
            '<div>' + getCurrentDatetime() + ' - ' + msg + '</div>'
        )
    }

    const getHhIds = () => {
        const hhIds = {}
        document.querySelectorAll(get_links_selector()).forEach((el) => {
            const parentEl = el.closest(get_el_selector())
            if (
                typeof parentEl.dataset.hh20241106Finded !== 'undefined'
                && parentEl.dataset.hh20241106Finded === 'true'
            ) {
                return
            }
            const hhId = el.href.split('?vacancyId=')[1].split('&employerId=')[0]
            hhIds[hhId + ''] = hhId
        })
        return hhIds
    }

    let hhIds

    const run = () => {

        hhIds = getHhIds()

        if (!Object.keys(hhIds).length) {
            alertFns('No ids!!!')
            setTimeout(run, 888)
            return
        }

        const formData = new FormData()

        formData.append('params_json', JSON.stringify({
            'hh_ids': Object.keys(hhIds),
            'profile': localStorage.getItem('HH20241106-profile'),
        }))

        fetch('http://localhost:' + uvicornPort + '/check', {
            method: 'post',
            body: formData,
        })
        .then(response => response.json())
        .catch(error => success(false, error))
        .then(data => success(data))
    }

    const proccess = (data) => {
        data.finded_hh_ids.forEach((hhId) => {
            document.querySelectorAll(get_links_selector(hhId)).forEach((el) => {
                const parentEl = el.closest(get_el_selector())
                parentEl.dataset.hh20241106Finded = 'true'
                if (typeof hhIds[hhId] !== 'undefined') {
                    delete hhIds[hhId]
                }
            })
        })
        Object.entries(hhIds).forEach((val, i) => {
            const hhId = val[0]
            document.querySelectorAll(get_links_selector(hhId)).forEach((el) => {
                const parentEl = el.closest(get_el_selector())
                if (
                    typeof parentEl.dataset.hh20241106BtnAdded !== 'undefined'
                    && parentEl.dataset.hh20241106BtnAdded === 'true'
                ) {
                    return
                }
                parentEl.dataset.hh20241106BtnAdded = 'true'
                parentEl.insertAdjacentHTML(
                    'afterbegin',
                    '<div class="HH20241106-btn-added js-HH20241106-btn-added"' +
                    ' data-hh-id="' + hhId + '">Meow</div>'
                )
            })
        })
        document.querySelectorAll('.js-HH20241106-btn-added').forEach((el) => {
            if (
                typeof el.dataset.hh20241106BtnAddedBinded !== 'undefined'
                && el.dataset.hh20241106BtnAddedBinded === 'true'
            ) {
                return
            }
            el.dataset.hh20241106BtnAddedBinded = 'true'
            el.addEventListener('click', (e) => {
                const formData = new FormData()
                formData.append('params_json', JSON.stringify({
                    'hh_id': e.currentTarget.dataset.hhId,
                    'profile': localStorage.getItem('HH20241106-profile'),
                }))
                fetch('http://localhost:' + uvicornPort + '/added', {
                    method: 'post',
                    body: formData,
                })
                .then(response => response.json())
                .catch(error => success(false, error))
                .then(data => success(data))
            })
        })
        setTimeout(run, 88)
    }

    const success = (data, msg) => {
        if (
            data === false
            || typeof data !== 'object'
            || (typeof data === 'object' && data.res !== true)
        ) {
            alert('Error!!!')
            console.log('Error!!!', data, msg)
        }
        else {
            if (
                typeof data.act !== 'undefined'
                && data.act === 'check'
            ) {
                proccess(data)
            }
        }
    }

    run()
})()
