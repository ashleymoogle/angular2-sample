import 'core-js/shim'
import 'zone.js'

import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `<div class="main">
                    <h1>Hello {{name}}</h1>
               </div>`
})
export class MainContainer { name = 'Angular'; }