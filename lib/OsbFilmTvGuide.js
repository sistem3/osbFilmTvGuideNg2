"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const http_1 = require('@angular/http');
require('ScrollMagic');
let OsbFilmTvGuide = class OsbFilmTvGuide {
    constructor(http) {
        this.http = http;
        this.isLoading = true;
        this.modalShowing = false;
        this.storagePrefix = '';
        this.baseUrl = '';
        this.apiKey = '';
        this.section = '';
        this.searchTerm = '';
        this.pageNumber = 1;
        this.feedData = [];
        this.modalData = {};
        this.user = {
            favourites: [],
            watched: []
        };
        this.sections = [];
        this.isLoading = true;
        this.modalShowing = false;
        this.storagePrefix = 'osbFilmTvGuide.user';
        this.baseUrl = 'https://api.themoviedb.org/3/';
        this.apiKey = '892ae99b0451fed76a0ece0a8d0c1414';
        this.section = 'movie';
        this.searchTerm = 'popular';
        this.pageNumber = 1;
        this.sections = [
            { name: 'Popular movies', section: 'movie', searchTerm: 'popular', icon: 'fa-film' },
            { name: 'Upcoming Movies', section: 'movie', searchTerm: 'upcoming', icon: 'fa-film' },
            { name: 'Top Rated Movies', section: 'movie', searchTerm: 'top_rated', icon: 'fa-film' },
            { name: 'Popular TV Shows', section: 'tv', searchTerm: 'popular', icon: 'fa-desktop' },
            { name: 'Top Rated TV Shows', section: 'tv', searchTerm: 'top_rated', icon: 'fa-desktop' }
        ];
        if (localStorage.getItem('osbFilmTvGuide.user')) {
            this.user = JSON.parse(localStorage.getItem('osbFilmTvGuide.user'));
        }
        this.getData(this.section, this.searchTerm);
    }
    addFavourite(id) {
        if (this.user.favourites) {
            var exists = false;
            this.user.favourites.forEach(function (element, index, array) {
                if (element.id == id) {
                    exists = true;
                }
            });
            if (!exists) {
                this.user.favourites.push({ 'section': this.section, 'id': id });
                localStorage.setItem(this.storagePrefix, JSON.stringify(this.user));
            }
        }
        this.checkFavourites(id);
    }
    checkFavourites(id) {
        this.user.favourites.forEach(function (element) {
            if (element.id === id) {
                setTimeout(function () {
                    var matchElement = document.getElementById(id);
                    matchElement.querySelector('.favouriteBtn').classList.add('favouriteActive');
                }, 100);
            }
        });
    }
    addWatched(id) {
        if (this.user.watched) {
            var exists = false;
            this.user.watched.forEach(function (element, index, array) {
                if (element.id == id) {
                    exists = true;
                }
            });
            if (!exists) {
                this.user.watched.push({ 'section': this.section, 'id': id });
                localStorage.setItem(this.storagePrefix, JSON.stringify(this.user));
            }
        }
        this.checkWatched(id);
    }
    checkWatched(id) {
        this.user.watched.forEach(function (element) {
            if (element.id === id) {
                setTimeout(function () {
                    var matchElement = document.getElementById(id);
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
        var holder = this;
        var updateData = data.json();
        updateData.results.forEach(function (element) {
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
        var holder = this;
        var feedData = data.json();
        this.isLoading = false;
        this.feedData = feedData.results;
        feedData.results.forEach(function (element) {
            holder.checkFavourites(element.id);
            holder.checkWatched(element.id);
        });
        setTimeout(function () {
            var controller = new ScrollMagic.Controller();
            var scene = new ScrollMagic.Scene({ triggerElement: '#filmLoader', triggerHook: 'onEnter' })
                .addTo(controller)
                .on('enter', function (e) {
                if (document.querySelector('#filmLoader').className.indexOf('active') == -1) {
                    holder.getMoreData();
                }
            });
            scene.update();
        }, 500);
    }
};
OsbFilmTvGuide = __decorate([
    core_1.Component({
        selector: 'osb-film-tv-guide',
        templateUrl: 'vendor/osb-film-tv-guide/lib/OsbFilmTvGuide.html',
        styleUrls: ['vendor/osb-film-tv-guide/lib/OsbFilmTvGuide.css']
    }), 
    __metadata('design:paramtypes', [http_1.Http])
], OsbFilmTvGuide);
exports.OsbFilmTvGuide = OsbFilmTvGuide;
//# sourceMappingURL=OsbFilmTvGuide.js.map