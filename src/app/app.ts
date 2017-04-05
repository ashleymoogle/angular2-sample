import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MainContainer }  from './mainContainer';

@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ MainContainer ],
    bootstrap:    [ MainContainer ]
})
export class App { }