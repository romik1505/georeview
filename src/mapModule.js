export class InteractiveMap {

    constructor(onClick){
        this.onClick = onClick
    }

    loadYmaps() {
        return new Promise((resolve) => ymaps.ready(resolve));
    }

    injectYmapsScript() {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = "https://api-maps.yandex.ru/2.1/?apikey=9d34524e-91e2-418e-8270-f705c0be8699&lang=ru_RU"
            script.type = "text/javascript"

            document.body.appendChild(script);
            script.addEventListener("load", resolve)
        });
    }

    initMap() {
        this.myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 13,
            controls: ['zoomControl']
        });

        this.myMap.events.add('click', e => {
            this.onClick(e.get('coords'))   
        })

        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false,
        });

        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });

        this.myMap.geoObjects.add(this.clusterer);
    }

    async init() {
        await this.injectYmapsScript();
        await this.loadYmaps();
        this.initMap();
    }   

    openBalloon(coords, content){
        this.myMap.balloon.open(
            coords,
            {
                content: content,
            }
        )
    }
    closeBalloon(){
        this.myMap.balloon.close()
    }

    createPlacemark(coords){
        const placeMark = new ymaps.Placemark(coords)
        placeMark.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(placeMark)
    }
}
