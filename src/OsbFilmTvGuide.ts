import {Component} from '@angular/core';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import 'ScrollMagic';
declare let ScrollMagic;
let scrollScene, scrollController;

@Component({
    selector: 'osb-film-tv-guide',
    templateUrl: 'node_modules/osb-film-tv-guide/lib/OsbFilmTvGuide.html',
    styleUrls: ['node_modules/osb-film-tv-guide/lib/OsbFilmTvGuide.css']
})
export class OsbFilmTvGuide {
    isLoading = true;
    modalShowing = false;
    storagePrefix = '';
    baseUrl = '';
    apiKey = '';
    section = '';
    searchTerm = '';
    pageNumber = 1;
    feedData = [];
    modalData = {};
    user = {
        favourites: [],
        watched: []
    };
    sections = [];

    constructor(public http: Http) {
        this.isLoading = true;
        this.modalShowing = false;
        this.storagePrefix = 'osbFilmTvGuide.user';
        this.baseUrl = 'https://api.themoviedb.org/3/';
        this.apiKey = '892ae99b0451fed76a0ece0a8d0c1414';
        this.section = 'movie';
        this.searchTerm = 'popular';
        this.pageNumber = 1;
        this.sections = [
            {name: 'Popular Movies', section: 'movie', searchTerm: 'popular', icon: 'fa-film'},
            {name: 'Upcoming Movies', section: 'movie', searchTerm: 'upcoming', icon: 'fa-film'},
            {name: 'Top Rated Movies', section: 'movie', searchTerm: 'top_rated', icon: 'fa-film'},
            {name: 'Popular TV Shows', section: 'tv', searchTerm: 'popular', icon: 'fa-desktop'},
            {name: 'Top Rated TV Shows', section: 'tv', searchTerm: 'top_rated', icon: 'fa-desktop'}
        ];
        if (localStorage.getItem('osbFilmTvGuide.user')) {
            this.user = JSON.parse(localStorage.getItem('osbFilmTvGuide.user'));
        }
        this.getData(this.section, this.searchTerm);
        //console.log(this.user);
        let holder = this;
        window.onbeforeunload = function(e) {
            holder.destroyEvents();
        };
    }

    destroyEvents() {
        if (scrollScene) {
            scrollScene.destroy();
        }
    }

    addFavourite(id) {
        if (this.user.favourites) {
            let exists = false;
            this.user.favourites.forEach(function(element, index, array) {
                if(element.id == id) {
                    exists = true;
                }
            });
            // If the id doesn't exist add
            if (!exists) {
                this.user.favourites.push({'section': this.section,'id': id});
                localStorage.setItem(this.storagePrefix, JSON.stringify(this.user));
            }
        }
        this.checkFavourites(id);
    }

    checkFavourites(id) {
        this.user.favourites.forEach(function(element) {
            if (element.id === id) {
                setTimeout(function() {
                    let matchElement = document.getElementById(id);
                    matchElement.querySelector('.favouriteBtn').classList.add('favouriteActive');
                }, 100);
            }
        });
    }

    addWatched(id) {
        if (this.user.watched) {
            let exists = false;
            this.user.watched.forEach(function(element, index, array) {
                if(element.id == id) {
                    exists = true;
                }
            });
            // If the id doesn't exist add
            if (!exists) {
                this.user.watched.push({'section': this.section,'id': id});
                localStorage.setItem(this.storagePrefix, JSON.stringify(this.user));
            }
        }
        this.checkWatched(id);
    }

    checkWatched(id) {
        this.user.watched.forEach(function(element) {
            if (element.id === id) {
                setTimeout(function() {
                    let matchElement = document.getElementById(id);
                    matchElement.querySelector('.watchedBtn').classList.add('watchedActive');
                }, 100);
            }
        });
    }

    closeModal() {
        this.modalShowing = false;
        this.modalData = {};
    }

    getDetails(id) {
        this.http.get(this.baseUrl + this.section + '/' + id + '?api_key=' + this.apiKey)
            .subscribe(response => this.setDetails(response));
    }

    setDetails(data) {
        this.modalData = data.json();
        this.modalShowing = true;
    }

    updateData(data) {
        let holder = this;
        let updateData = data.json();
        updateData.results.forEach(function(element) {
            holder.feedData.push(element);
        });
    }

    getMoreData() {
        this.pageNumber += 1;
        this.http.get(this.baseUrl + this.section + '/' + this.searchTerm + '?page=' + this.pageNumber + '&api_key=' + this.apiKey)
            .subscribe(response => this.updateData(response));
    }

    getData(section, searchTerm) {
        this.pageNumber = 1;
        this.isLoading = true;
        this.section = section;
        this.http.get(this.baseUrl + section + '/' + searchTerm + '?api_key=' + this.apiKey)
            .subscribe(response => this.setData(response));
    }

    setData(data) {
        let holder = this;
        let feedData = data.json();
        this.isLoading = false;
        this.feedData = feedData.results;
        feedData.results.forEach(function(element) {
            holder.checkFavourites(element.id);
            holder.checkWatched(element.id);
        });
        setTimeout(function() {
            scrollController = new ScrollMagic.Controller();
            scrollScene = new ScrollMagic.Scene({triggerElement: '#filmLoader', triggerHook: 'onEnter'})
                .addTo(scrollController)
                .on('enter', function (e) {
                    if (document.querySelector('#filmLoader').className.indexOf('active') == -1) {
                        holder.getMoreData();
                    }
                });
            scrollScene.update();
        }, 500);
    }

}