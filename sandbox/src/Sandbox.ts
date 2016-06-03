import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import 'ScrollMagic';
declare let ScrollMagic;
import {OsbFilmTvGuide} from 'osb-film-tv-guide/components';

@Component({
    selector: 'sandbox',
    directives: [OsbFilmTvGuide],
    template: `<osb-film-tv-guide></osb-film-tv-guide>`
})
export class Sandbox {
    constructor() {
        console.log('Sandbox Loaded');
    }
}

bootstrap(Sandbox, HTTP_PROVIDERS);