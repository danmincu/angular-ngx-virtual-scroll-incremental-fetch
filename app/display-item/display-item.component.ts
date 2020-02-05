import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Observable, Subject, interval } from "rxjs";
import { throttle, delayWhen } from "rxjs/operators";

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.scss']
})
export class DisplayItemComponent implements OnInit, OnChanges {

  @Input() item: string;

  comesIntoView = new Subject<any>()
  
  private _id: number;
  @Input() set id(i) {
    if (this._id != i) {
        console.log("setter for " + i + " was called ");
    }
    this._id = i;
  }

  get id()
  {
    return this._id;
  }
  
  subscription;
  constructor() {
  }

  isHeader: boolean;

  ngOnInit() {
    // PLEASE NOTE THIS IS CALLED ALL THE TIME, CONTAINER REUTILIZATION IS **NOT** BEING UTILIZED
   // console.log("ngOnInit for " + this.item + " was called!");

    this.subscription = this.comesIntoView.pipe(delayWhen(val => interval(10000))).subscribe((i) =>
       console.log("Late notification from: " + this.item))

    this.comesIntoView.next(this.id);

    this.isHeader = this.item.startsWith('involvement');
  }

  ngOnDestroy() {
    // PLEASE NOTE THIS IS CALLED ALL THE TIME, CONTAINER REUTILIZATION IS **NOT** BEING UTILIZED
    console.log("ngOnDestroy for " + this.item + " was called!");
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(changes) {
    // PLEASE NOTE THIS NEVER HAPPENS AS COMPARED TO THE https://stackblitz.com/edit/angular-cdk-demo-virtual-scroll-lifecycle
    if (changes.id && !changes.id.firstChange && changes.id.previousValue > 0)
    {
     //  console.log("Reutilizing container:[" + changes.id.previousValue + "] for ["+ changes.id.currentValue +"]");
    }
  }
}