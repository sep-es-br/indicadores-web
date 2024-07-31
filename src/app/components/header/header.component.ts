import { Component, ElementRef, HostListener, Input, OnInit } from "@angular/core";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

	@Input() background:boolean = false;

	public openButton = "<i class='fa-solid fa-ellipsis-vertical iconMenu text-white fs-3'></i>";
	public closeButton = "<i class='fa-solid fa-xmark iconMenu text-white fs-3'></i>";
	public menuButton = this.openButton;

	constructor(private el: ElementRef) {}

	ngOnInit(): void {
	}

	isScrolled = false;
	isNavbarCollapsed = false;

	ngAfterContentChecked(): void {
		//Called after every check of the component's or directive's content.
		//Add 'implements AfterContentChecked' to the class.
		
		const toggler = this.el.nativeElement.querySelector(".navbar-toggler");
		const icon = toggler.querySelector("svg.iconMenu");
	
		toggler.addEventListener("click", () => {
			console.log("Clicou no botão de menu");
			console.log(icon);
			console.log(toggler.classList);
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