import './map.css'
import { InteractiveMap } from './mapModule'
let balloonTemplate = require('../templates/balloon.hbs')

class GeoReview {
    constructor() {
        this.formTemlplate = balloonTemplate
        this.map = new InteractiveMap(this.onClick.bind(this))
        this.map.init().then(this.init.bind(this))
    }

    async init() {
        document.body.addEventListener('click', (e) => {
            if (e.target.id === 'add__btn') {
                const coords = document.querySelector('.review-form').dataset.coords.split(',')
                const body = {
                    coords: [parseFloat(coords[0]), parseFloat(coords[1])],
                    author: document.querySelector('#name').value,
                    place: document.querySelector('#place').value,
                    text: document.querySelector('#review').value
                }
                this.postCallApi("review", body)
                this.map.createPlacemark(coords)
                this.map.closeBalloon()
            }
        })

        const coords = await this.getCoords()
        console.log(coords)
        for (const coord of coords) {
            this.map.createPlacemark(coord)
        }
    }

    async onClick(coords){
        const data = await this.callApi(`review?latitude=${coords[0]}&longitude=${coords[1]}`)
        const template = balloonTemplate({
            coords: coords,
            reviews: data
        })
        this.map.openBalloon(coords, template)
    }

    async callApi(path) {
        return fetch(`http://localhost:8000/${path}`)
        .then(response => {
            console.log(response)
            return response.text()})
        .then((data) => {
            return data ? JSON.parse(data) : {}
        })
    }

    async postCallApi(path, body = {}) {
        console.log(body)
        return fetch(`http://localhost:8000/${path}`,{
            method: 'POST',
            body: JSON.stringify(body)
        }).then(r => r.text())
        .then((data) => data ? JSON.parse(data) : {});
    }

    async getCoords(){
        return this.callApi('coords')
    }
}

new GeoReview()
