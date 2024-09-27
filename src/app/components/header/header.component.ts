import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { IAdministration } from "../../shared/interfaces/administration.interface";
import { HomeService } from "../../shared/services/home/home.service";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

	@Input() background:boolean = false;
	@Input() showAdminList: boolean = false;
	@Output() selectionChange = new EventEmitter<string>();

	public openButton = "<i class='fa-solid fa-ellipsis-vertical iconMenu text-white fs-3'></i>";
	public closeButton = "<i class='fa-solid fa-xmark iconMenu text-white fs-3'></i>";
	public menuButton = this.openButton;
	public administrationList: IAdministration[] = []

	constructor(private el: ElementRef,private _homeService: HomeService) {}

	ngOnInit(): void {
		if(this.showAdminList){
			const responseData = this._homeService.administrationList();
		responseData.subscribe(
			data=> {
				this.administrationList = data;
				this.selectionChange.emit(this.administrationList[0].id);
			}
		);

		}
	}

	isScrolled = false;
	isNavbarCollapsed = false;

	onSelectionChange(event: Event) {
		const selectedValue = (event.target as HTMLSelectElement).value;
		this.selectionChange.emit(selectedValue);
	  }

	ngAfterContentChecked(): void {
		//Called after every check of the component's or directive's content.
		//Add 'implements AfterContentChecked' to the class.
		
		const toggler = this.el.nativeElement.querySelector(".navbar-toggler");
		const icon = toggler.querySelector("svg.iconMenu");
	
		toggler.addEventListener("click", () => {
			if (toggler.classList.contains("collapsed")) {
				this.menuButton = this.openButton;
			} else {
				this.menuButton = this.closeButton;
			}
		});
	}
  

  @HostListener("window:scroll", ["$event"])
	onWindowScroll() {
		const scrollPosition = window.scrollY;
		const threshold = 250; // Ajuste este valor conforme necessário

		this.isScrolled = scrollPosition > threshold;
	}

}