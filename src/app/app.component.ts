import { Component, Input, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  template: `
  <div>
    <img [src]="quokkaData" />
    <img [src]="quokkaAsyncData | async" /> 
  </div>`,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  public quokkaAsyncData: Observable<string>;
  public quokkaData: string;

  constructor(private httpSvc: HttpClient) { }

  ngOnInit() {
    // Method 1: Pass observer directly to template where "| async" is used.
    this.quokkaAsyncData = this.downloadDataAsBase64('https://pbs.twimg.com/media/DR15b9eWAAEn7eo.jpg');

    // Method 2: Get data from subscriber and pass to image src
    this.downloadDataAsBase64('https://pbs.twimg.com/media/DR15b9eWAAEn7eo.jpg')
      .subscribe((base64Data: string) => {
        this.quokkaData = base64Data;
      });
  }

  //#region Util methods

  private downloadDataAsBase64(url: string): Observable<string> {
    return this.httpSvc.get(url, { responseType: 'blob' }).pipe(
      flatMap(blob => {
        return this.blobToBase64(blob);
      })
    );
  }

  private blobToBase64(blob: Blob): Observable<any> {
    const fileReader = new FileReader();
    const observable = new Observable(observer => {
      fileReader.onloadend = () => {
        observer.next(fileReader.result);
        observer.complete();
      };
    });
    fileReader.readAsDataURL(blob);
    return observable;
  }

  //#region Util methods
}
