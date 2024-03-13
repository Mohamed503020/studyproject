import { Component, Input, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { v4 as guidGenerator } from 'uuid';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {

  generatedIndex = guidGenerator();
   searchTearm :string =' '
  @Input() isShowSidebar: boolean = false;
  @Input() isDisableAutoRefresh: boolean = false;
  @Input() toggleBtnHeight: string = '40px';
  @Input() zIndex: number | null = null;
  @Input() top: number | null = null;

  @Output() onFilterEmit = new EventEmitter();
  @Output() onClearFilterEmit = new EventEmitter();

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const toggleButton = this.el.nativeElement.querySelector(`#right-sidebar_${this.generatedIndex} .selector-toggle > a`);
    this.renderer.setStyle(toggleButton, 'top', this.toggleBtnHeight);
  }

  show() {
    this.isShowSidebar = true;
  }

  hide() {
    this.isShowSidebar = false;
  }

  toggleShowSidebar() {
    this.isShowSidebar = !this.isShowSidebar;
  }

  filter() {
    console.log("filteration");
    this.onFilterEmit.emit(this.searchTearm);
  }

  clearFilter() {
    this.onClearFilterEmit.emit();
    if (this.isDisableAutoRefresh) {
      setTimeout(() => {
        this.onFilterEmit.emit();
      }, 500);
    }
  }

  handleEnterKey(event: KeyboardEvent) {
    if (this.isShowSidebar) {
      event.preventDefault();
      this.onFilterEmit.emit();
    }
  }
}
