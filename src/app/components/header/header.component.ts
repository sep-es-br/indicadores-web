import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { IAdministration } from "../../shared/interfaces/administration.interface";
import { HomeService } from "../../shared/services/home/home.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

	@Input() background:boolean = false;
	@Output() selectionChange = new EventEmitter<string>();

	public openButton = "<i class='fa-solid fa-ellipsis-vertical iconMenu text-white fs-3'></i>";
	public closeButton = "<i class='fa-solid fa-xmark iconMenu text-white fs-3'></i>";
	public menuButton = this.openButton;
	public administrationList: IAdministration[] = []
	public selectedAdminId!: string | null;

	constructor(private el: ElementRef,private _homeService: HomeService, private router: Router) {}

	ngOnInit(): void {
		const responseData = this._homeService.administrationList();
		responseData.subscribe(
			data=> {
				this.administrationList = data;
				const storedId = sessionStorage.getItem('adminId');
				this.selectedAdminId = storedId !== null ? storedId : this.administrationList[0].id;
				this.selectionChange.emit(this.selectedAdminId);
			}
		);
	}

	isScrolled = false;
	isNavbarCollapsed = false;

	onSelectionChange(event: Event) {
		const selectedValue = (event.target as HTMLSelectElement).value;
		this.selectionChange.emit(selectedValue);
		sessionStorage.setItem('adminId', selectedValue);
		if (this.router.url !== '/home') {
			this.router.navigate(['/home']);
		  }
	  }

	ngAfterContentChecked(): void {
		
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
		const threshold = 100; // Ajuste este valor conforme necessário

		this.isScrolled = scrollPosition > threshold;
	}

	logout() {
		window.location.href = 'https://acessocidadao.es.gov.br/is/logout';
	  }

}